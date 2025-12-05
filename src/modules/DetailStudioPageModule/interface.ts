export interface StudioDetailProps {
  wikidataUri: string;
  name: string;
  notableWorks?: string[];   
  founders?: string[];        
  originCountry?: string;     
  officialWebsite?: string;  
  logo?: string;              
}

export interface StudioDetailResponseProps {
  status: number;
  message: string;
  data: StudioDetailProps;
}