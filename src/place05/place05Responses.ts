declare module Place05Responses {

    export interface AvailablePlace {
        numberOfPlace: string;
        from: string;
        availableDate: string;
        to: string;
        type: string;
    }

    export interface Term {
        index: string;
        logical: string;
        match: string;
        value: string;
    }

    export interface Q {
        terms: Term[];
    }

    export interface Item {
        facetClauses: any[];
        facetClausesForQuery: any[];
        id: string;
        includeInSearchHistory: boolean;
        isSaved: boolean;
        lastFetched: Date;
        lastNumHits: number;
        lastQueryTimeInMs: number;
        order: string;
        q: Q;
        saved: boolean;
    }

    export interface MappedFQ {
    }

    export interface Term2 {
        display: boolean;
        index: string;
        logicalOp: string;
        matching: string;
        term: string;
        termid: number;
    }

    export interface Model {
        terms: Term2[];
    }

    export interface AnnotatedSavedSearch {
        facetClause: any[];
        item: Item;
        mappedFQ: MappedFQ;
        model: Model;
        query: string;
        searchStatement: string;
        type: string;
    }

    export interface Title {
        DUT: string;
        ENG: string;
        ES: string;
        FRE: string;
        GER: string;
    }

    export interface Config {
        displayRemoveFacet: boolean;
        displayValuesOnLoad: boolean;
        dynamicFacet: boolean;
        facetQueries: any[];
        index: string;
        pivotFacet: boolean;
        pivotNames: any[];
        sort: string;
        sortOrderAsc: boolean;
        title: Title;
        treeValuesOpened: any[];
        visualization: string;
    }

    export interface Item2 {
        caption: string;
        classLink: string;
        count: number;
        display: string;
        quotedValue: string;
        value: string;
    }

    export interface Facet {
        caption: string;
        code: string;
        config: Config;
        display: string;
        items: Item2[];
        multiSelect: boolean;
        name: string;
        rawCount: number;
        seeMore: boolean;
        showPaginate: boolean;
        total: number;
        totalPage: number;
    }

    export interface Glatlong {
        value: string;
    }

    export interface Type {
        value: string;
    }

    export interface Address {
        value: string;
    }

    export interface PosInSet {
        value: string;
    }

    export interface Title2 {
        value: string;
    }

    export interface TypeOfDocumentFacet {
        value: string;
    }

    export interface GroupAge {
        value: string;
    }

    export interface Url {
        value: string;
    }

    export interface ImageSource512 {
        value: string;
    }

    export interface UrlTarget {
        value: string;
    }

    export interface Score {
        value: string;
    }

    export interface ImageSource128 {
        value: string;
    }

    export interface IsPhysicalDocument {
        value: string;
    }

    export interface Type2 {
        display: string;
        value: string;
    }

    export interface Address2 {
        display: string;
        value: string;
    }

    export interface EmailAddress {
        display: string;
        value: string;
    }

    export interface AvailablePlace {
        display: string;
        value: string;
    }

    export interface DisplayAddress {
        display: string;
        value: string;
    }

    export interface DisplayPhone {
        display: string;
        value: string;
    }

    export interface DisplayEmailAddress {
        display: string;
        value: string;
    }

    export interface Pcr {
        display: string;
        value: string;
    }

    export interface NombrePlacesMilieuFamilial {
        display: string;
        value: string;
    }

    export interface AcceptTerm {
        value: string;
    }

    export interface SdgName {
        value: string;
    }

    export interface Meta {
        type: Type2[];
        address: Address2[];
        emailAddress: EmailAddress[];
        availablePlace: AvailablePlace[];
        displayAddress: DisplayAddress[];
        displayPhone: DisplayPhone[];
        displayEmailAddress: DisplayEmailAddress[];
        pcr: Pcr[];
        nombrePlacesMilieuFamilial: NombrePlacesMilieuFamilial[];
        acceptTerms: AcceptTerm[];
        sdgName: SdgName[];
    }

    export interface ImageSource256 {
        value: string;
    }

    export interface ThumbSVCQueryParam {
        value: string;
    }

    export interface ExternalLink {
        value: string;
    }

    export interface ShowMoreLikeThi {
        value: string;
    }

    export interface Id {
        value: string;
    }

    export interface State {
        value: string;
    }

    export interface DisplayCopiesInfo {
        value: string;
    }

    export interface WEBSITEETAB {
        value: string;
    }

    export interface ResultSet {
        glatlong: Glatlong[];
        type_s: Type[];
        address: Address[];
        posInSet: PosInSet[];
        title: Title2[];
        TypeOfDocumentFacet: TypeOfDocumentFacet[];
        groupAge: GroupAge[];
        url: Url[];
        imageSource_512: ImageSource512[];
        urlTarget: UrlTarget[];
        score: Score[];
        imageSource_128: ImageSource128[];
        IsPhysicalDocument: IsPhysicalDocument[];
        meta: Meta;
        imageSource_256: ImageSource256[];
        __thumbSVCQueryParam: ThumbSVCQueryParam[];
        externalLinks: ExternalLink[];
        showMoreLikeThis: ShowMoreLikeThi[];
        id: Id[];
        state: State[];
        displayCopiesInfo: DisplayCopiesInfo[];
        WEBSITE_ETAB: WEBSITEETAB[];
    }

    export interface SortCriteria {
        label: string;
        value: string;
    }

    export interface Response {
        annotatedSavedSearch: AnnotatedSavedSearch;
        facetSelections: any[];
        facets: Facet[];
        fq: string[];
        maxPageNo: number;
        maxScore: number;
        numHits: number;
        pageNo: number;
        pageSize: number;
        query: string;
        queryComponents: any[];
        querySyntax: string;
        queryid: string;
        resultSet: ResultSet[];
        solrQuery: string;
        sortCriteria: SortCriteria[];
        sortOrder: string;
    }

}