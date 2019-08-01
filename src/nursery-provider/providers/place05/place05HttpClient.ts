import * as request from 'request';
import {NurseryProvider} from '../../nurseryProvider';

export class Place05HttpClient implements NurseryProvider.Provider {

    public async getSummary({lat, lng, km}: { lat: number; lng: number; km: number }): Promise<NurseryProvider.NurserySummaryResponse[]> {
        const nurseries = await this.getNurseries({lat, lng, km});
        return Promise.all(nurseries.map(nursery => new Promise<{ nursery: NurseryProvider.Nursery, availablePlaces: NurseryProvider.NurseryAvailablePlace[] }>((resolve, reject) => {
            this.getAvailablePlacesForNursery(nursery).then(availablePlaces => resolve({
                nursery, availablePlaces
            })).catch(reject);
        })));
    }

    public async getNurseries({lat, lng, km}: { lat: number; lng: number; km: number; }): Promise<NurseryProvider.Nursery[]> {
        return new Promise<NurseryProvider.Nursery[]>((resolve, reject) => {
            request({
                url: 'https://www.laplace0-5.com/in/rest/api/search',
                method: 'POST',
                body: `{"includeFacets":false,"order":"score","queryid":"geosearch_mainSite","mappedFQ":{},"syntax":"ccl","pageNo":1,"pageSize":250,"glatlong":"${lat},${lng}","distance":${km},"fl":"address,WEBSITE_ETAB,state,TYPE_FINANCEMENT_COMPO_s,ADRESSE_COMPO_t,NOM_MUN_COMPO_s,CODE_POSTAL_COMPO_t,ruleIcon,groupAge,type_s","fq":["TypeOfDocumentFacet:(SDG RSG)","-TYPE_FINANCEMENT_COMPO_s:BC-MF","-state_s:(S C)","-active_t:0","type_s:(MF_NON_SUBV_DISPO MF_DISPO)"],"facetFields":"type_s,availablePlace_s,groupAge_s,mealType_s,careFreqType_s,startHour_s,endHour_s,moreInfo_s,specialNeeds_s,enterprisePriority_s,schoolPriority_s","locale":"fr"}`,
            }, (error, _, body) => {
                if (error) {
                    reject(error);
                } else {
                    const nurseries: NurseryProvider.Nursery[] = (JSON.parse(body) as Place05Response.Response).resultSet.map(x => ({
                        id: x.id[0].value.substring(3),
                        name: (x.meta.sdgName && x.meta.sdgName.length) ? x.meta.sdgName[0].value : '',
                        emailAddress: (x.meta.emailAddress && x.meta.emailAddress.length) ? x.meta.emailAddress[0].value : '',
                        address: x.meta.address && x.meta.address.length ? x.meta.address[0].value : ''
                    }));
                    resolve(nurseries);
                }
            });
        });
    }

    public async getAvailablePlacesForNursery(nursery: NurseryProvider.Nursery): Promise<NurseryProvider.NurseryAvailablePlace[]> {
        return new Promise<NurseryProvider.NurseryAvailablePlace[]>((resolve, reject) => {
            request({
                url: `https://www.laplace0-5.com/in/rest/sdgApi/getAvailablePlaces?id=${nursery.id}&_=${new Date().getTime()}`,
            }, (error, _, body) => {
                if (error) {
                    reject(error);
                } else {
                    const availablePlaces: NurseryProvider.NurseryAvailablePlace[] = (JSON.parse(body) as Place05Response.AvailablePlace[]).map(x => ({
                        availablePlaceCount: +x.numberOfPlace,
                        monthFrom: +x.from,
                        monthTo: +x.to
                    })).reduce((a: NurseryProvider.NurseryAvailablePlace[], b: NurseryProvider.NurseryAvailablePlace) => {
                        const existingEntry = a.find(x => x.monthFrom === b.monthFrom && x.monthTo === b.monthTo);
                        if (existingEntry) {
                            existingEntry.availablePlaceCount = existingEntry.availablePlaceCount + 1;
                            return [...a];
                        } else {
                            return [...a, b];
                        }
                    }, []);
                    resolve(availablePlaces);
                }
            });
        });
    }

}
