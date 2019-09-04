import * as inquirer from 'inquirer';
import { Place05HttpClient } from './nursery-provider/providers/place05/place05HttpClient';
import { NurseryProvider } from './nursery-provider/nurseryProvider';
import { GoogleMap } from './google-map/googleMap';
import chalk from 'chalk';
import { PlaceAutocompleteResult } from '@google/maps';
import ora = require('ora');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

(async () => {

    GoogleMap.init();

    const questions = [
        <any>{
            message: 'Recherche depuis quel endroit ?',
            name: 'location',
            pageSize: 4,
            type: 'autocomplete',
            source: async (answersSoFar, input) => new Promise<ReadonlyArray<inquirer.ChoiceType<{ name: string, value: any }>>>(async (resolve, reject) => {
                if (!input || !input.length) {
                    resolve([]);
                    return;
                }
                const locations = await GoogleMap.searchLocations(input);
                const choices = locations.map(x => (<inquirer.ChoiceType<{ name: string, value: any }>>{
                    name: x.description,
                    value: x,
                }));
                resolve(choices);
            })
        },
        {
            message: 'Combien de KM ?',
            name: 'km',
            type: 'number',
            validate: (answer) => {
                if (!+answer) {
                    return false;
                }
                if (+answer > 100) {
                    return 'Max 100 KM';
                }
                return true;
            }
        },
        {
            message: 'Pour un bébé d\'au moins combien de mois ?',
            name: 'month',
            type: 'number',
            validate: (answer) => {
                if (!+answer) {
                    return false;
                }
                if (+answer > 60) {
                    return 'Max 60 mois';
                }
                return true;
            }
        }
    ];

    const answers: {
        km: number,
        month: number,
        location: PlaceAutocompleteResult
    } = await inquirer.prompt(questions);

    const spinner = ora(`Recherche de place disponible pour un rayon de ${answers.km}KM de ${answers.location.structured_formatting.main_text} pour enfant de ${answers.month} mois et moins.`).start();

    const googleMapPlace = await GoogleMap.getPlaceDetails(answers.location.place_id);

    NurseryProvider.registerProvider(new Place05HttpClient());

    const nurseryAvailability = (await NurseryProvider.getSummary({
        km: answers.km,
        lat: googleMapPlace.geometry.location.lat,
        lng: googleMapPlace.geometry.location.lng
    })).filter(x => x.availablePlaces.some(x => x.monthFrom <= answers.month));

    spinner.succeed();
    console.log('');

    if (!nurseryAvailability.length) {
        console.log(chalk.red('Aucune correspondance'));
    }

    nurseryAvailability.forEach(nurseryAvailablePlace => {
        if (nurseryAvailablePlace.availablePlaces.length) {
            console.log(`${chalk.green('Garderie')}: ${nurseryAvailablePlace.nursery.name}`);
            console.log(`${chalk.green('Email')}: ${nurseryAvailablePlace.nursery.emailAddress}`);
            console.log(`${chalk.green('Adresse')}: ${nurseryAvailablePlace.nursery.address}`);
            nurseryAvailablePlace.availablePlaces.forEach(match => {
                console.log(`${chalk.green('Place Disponible')}: ${match.availablePlaceCount}x de ${chalk.bold(match.monthFrom.toString())} à ${chalk.bold(match.monthTo.toString())} mois.`);
            });
        } else {
            console.log(`La garderie de ${chalk.red(nurseryAvailablePlace.nursery.name)} affiche de la place disponible, mais ne correspond pas au critère d'âge recherché.`);
        }
        console.log('');
    });

})();
