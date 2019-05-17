import * as request from 'request';

export class Place05Client {

    public fetchNurseries({ lat, lng, km }: { lat: number; lng: number; km: number; }): Promise<Place05Responses.ResultSet[]> {
        return new Promise<Place05Responses.ResultSet[]>((resolve, reject) => {
            request({
                url: 'https://www.laplace0-5.com/in/rest/api/search',
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: `{"includeFacets":false,"order":"score","queryid":"geosearch_mainSite","mappedFQ":{},"syntax":"ccl","pageNo":1,"pageSize":100,"glatlong":"${lat},${lng}","distance":${km},"fl":"address,WEBSITE_ETAB,state,TYPE_FINANCEMENT_COMPO_s,ADRESSE_COMPO_t,NOM_MUN_COMPO_s,CODE_POSTAL_COMPO_t,ruleIcon,groupAge,type_s","fq":["TypeOfDocumentFacet:(SDG RSG)","-TYPE_FINANCEMENT_COMPO_s:BC-MF","-state_s:(S C)","-active_t:0","type_s:(MF_NON_SUBV_DISPO MF_DISPO)"],"facetFields":"type_s,availablePlace_s,groupAge_s,mealType_s,careFreqType_s,startHour_s,endHour_s,moreInfo_s,specialNeeds_s,enterprisePriority_s,schoolPriority_s","locale":"fr"}`,
            }, (error, _, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve((JSON.parse(body) as Place05Responses.Response).resultSet);
                }
            });
        });
    }

    public fetchAvailablePlaces(id: string): Promise<Place05Responses.AvailablePlace[]> {
        return new Promise<Place05Responses.AvailablePlace[]>((resolve, reject) => {
            request({
                url: `https://www.laplace0-5.com/in/rest/sdgApi/getAvailablePlaces?id=${id}&_=${new Date().getTime()}`,
                headers: {
                    'content-type': 'application/json',
                }
            }, (error, _, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body) as Place05Responses.AvailablePlace[]);
                }
            });
        });
    }

}
