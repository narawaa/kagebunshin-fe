export interface StudioDetailProps {
  wikidataUri: string;
  name: string;
  notableWorks?: string[];   
  founders?: string[];        
  originCountry?: string;     
  officialWebsite?: string;  
  logo?: string;              
  localAnime?: Array<{ uri?: string; title?: string }>;
}

export interface StudioDetailResponseProps {
  status: number;
  message: string;
  data: StudioDetailProps;
}