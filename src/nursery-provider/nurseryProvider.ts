export module NurseryProvider {

    const providers: Provider[] = [];

    export interface Provider {
        getSummary({lat, lng, km}: { lat: number; lng: number; km: number; }): Promise<NurserySummaryResponse[]>;
        getNurseries({lat, lng, km}: { lat: number; lng: number; km: number; }): Promise<Nursery[]>;
        getAvailablePlacesForNursery(nursery: Nursery): Promise<NurseryAvailablePlace[]>;
    }

    export interface NurseryAvailablePlace {
        availablePlaceCount: number;
        monthTo: number;
        monthFrom: number;
    }

    export interface NurserySummaryResponse {
        nursery: Nursery;
        availablePlaces: NurseryAvailablePlace[];
    }

    export interface Nursery {
        id: string;
        name: string;
        emailAddress: string;
        address: string;
    }

    export const registerProvider = (provider: Provider) => {
        providers.push(provider);
    };

    export const getSummary = async ({lat, lng, km}: { lat: number; lng: number; km: number; }): Promise<NurserySummaryResponse[]> => {
        return (await Promise.all(providers.map(x => x.getSummary({
            lat,
            lng,
            km
        })))).reduce((a: NurserySummaryResponse[], b: NurserySummaryResponse[]) => {
            return [...a, ...b];
        }, []).reduce((a: NurserySummaryResponse[], b: NurserySummaryResponse) => {
            const existingNursery = a.find(x => x.nursery.emailAddress === b.nursery.emailAddress);
            if (existingNursery) {
                return [...a];
            } else {
                return [...a, b];
            }
        }, []);
    };

}
