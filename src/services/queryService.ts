import { SparqlResponseProps } from "@/modules/QueryPageModule/interface";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function executeSparqlQuery(query: string): Promise<SparqlResponseProps> {
  try {
    const response = await fetch(`${API}/query/execute/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data: SparqlResponseProps = await response.json();
    return data;
  } catch {
    return { 
      status: 500,
      message: 'Server tidak merespons. Silakan coba lagi nanti.',
      data: [],
    };
  }
}
