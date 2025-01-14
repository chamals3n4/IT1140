import { Mistral } from "@mistralai/mistralai";
const apiKey = window.configs.mistralApiKey;

const mistral = new Mistral({ apiKey: apiKey });
export default mistral;
