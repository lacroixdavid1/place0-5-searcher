import chalk from 'chalk';
import googleMap = require('@google/maps');
import * as inquirer from 'inquirer';
import ora from 'ora';
import { Place05Client } from './place05/place05Client';
import { Config } from './config';
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

(async () => {

    let googleMapsClient: googleMap.GoogleMapsClient;

    googleMapsClient = googleMap.createClient({
        key: Config.place05GoogleMapApiKey
    });

    const questions = [
        <any>{
            message: 'Recherche depuis quel endroit ?',
            name: 'city',
            pageSize: 4,
            type: 'autocomplete',
            source: (answersSoFar, input) => new Promise<ReadonlyArray<inquirer.ChoiceType>>((resolve, reject) => {
                if (!input || !input.length) {
                    resolve([]);
                    return;
                }
                googleMapsClient.placesAutoComplete({
                    input: input,
                    language: 'fr',
                    
                    components: <any>{
                        country: ['ca'],
                    },
                    sessiontoken: ''
                }, (err, response) => {
                    if (err !== null && err !== undefined) {
                        reject(err);
                        return;
                    }
                    const choices = response.json.predictions.map(x => (<inquirer.ChoiceType>{
                        name: x.description,
                        value: x,
                    }));
                    resolve(choices);
                });
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
        city: googleMap.PlaceAutocompleteResult
    } = await inquirer.prompt(questions);

    const spinner = ora(`Recherche de place disponible pour un rayon de ${answers.km}KM de ${answers.city.structured_formatting.main_text} pour enfant de ${answers.month} mois et moins.`).start();

    const googleMapPlace = await new Promise<googleMap.PlaceDetailsResult>((resolve, reject) => {
        googleMapsClient.place({ placeid: answers.city.place_id }, (err, response) => {
            resolve(response.json.result);
        });
    });

    const place05Client = new Place05Client();
    const nurseries = await place05Client.fetchNurseries({
        km: answers.km,
        lat: googleMapPlace.geometry.location.lat,
        lng: googleMapPlace.geometry.location.lng
    });

    const nurseryAvailability = await Promise.all(nurseries.map(nursery => new Promise<{ nursery: Place05Responses.ResultSet, availablePlaces: Place05Responses.AvailablePlace[] }>((resolve, reject) => {
        place05Client.fetchAvailablePlaces(nursery.id[0].value.substring(3)).then(availablePlaces => resolve({
            nursery, availablePlaces
        })).catch(reject);
    })));

    spinner.succeed();
    console.log('');

    if(!nurseryAvailability.length){
        console.log(chalk.red('Aucune correspondance'));
    }

    nurseryAvailability.forEach(nurseryAvailablePlace => {
        const matchingPlaces = nurseryAvailablePlace.availablePlaces.filter(x => x && +x.numberOfPlace > 0 && +x.from <= answers.month).reduce((a: Place05Responses.AvailablePlace[], b: Place05Responses.AvailablePlace) => {
            const existingEntry = a.find(x => x.from === b.from && x.to === b.to);
            if (existingEntry) {
                existingEntry.numberOfPlace = `${+existingEntry.numberOfPlace + 1}`;
                return [...a];
            } else {
                return [...a, b];
            }
        }, <Place05Responses.AvailablePlace[]>[]);
        if (matchingPlaces.length) {
            console.log(`${chalk.green('Garderie')}: ${nurseryAvailablePlace.nursery.meta.sdgName[0].value}`);
            console.log(`${chalk.green('Email')}: ${nurseryAvailablePlace.nursery.meta.emailAddress ? nurseryAvailablePlace.nursery.meta.emailAddress[0].value : '-'}`);
            console.log(`${chalk.green('Adresse')}: ${nurseryAvailablePlace.nursery.meta.address[0].value}`);
            matchingPlaces.forEach(match => {
                console.log(`${chalk.green('Place Disponible')}: ${match.numberOfPlace}x de ${chalk.bold(match.from)} à ${chalk.bold(match.to)} mois.`);
            });
            console.log('');
        }
        else {
            console.log(`La garderie de ${chalk.red(nurseryAvailablePlace.nursery.meta.sdgName[0].value)} affiche de la place disponible, mais ne correspond pas au critère d'âge recherché.`);
        }
    });

})();
