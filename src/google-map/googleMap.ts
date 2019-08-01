import {Config} from '../config';
import {createClient, GoogleMapsClient, PlaceAutocompleteResult, PlaceDetailsResult} from '@google/maps';

export module GoogleMap {

    let googleMapsClient: GoogleMapsClient;

    export const init = () => {
        googleMapsClient = createClient({
            key: Config.place05GoogleMapApiKey
        });
    };

    export const searchLocations = async (location: string): Promise<PlaceAutocompleteResult[]> => {
        return new Promise<PlaceAutocompleteResult[]>((resolve, reject) => {
            googleMapsClient.placesAutoComplete({
                input: location,
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
                resolve(response.json.predictions);
            });

        });
    };

    export const getPlaceDetails = async (placeId: string) => {
        return new Promise<PlaceDetailsResult>((resolve, reject) => {
            googleMapsClient.place({placeid: placeId}, (err, response) => {
                resolve(response.json.result);
            });
        });
    };

}
