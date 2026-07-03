import type { GraphQLClientConfig,RequestListener ,RequestLifecycle} from "graphql-ormify-client";
import { hasuraGraphqlClientConfig as config } from "@/project-config";
export const graphqlOrmifyClientConfig: GraphQLClientConfig = {
  endpoint: config.endpoint,
  headers: config.headers,
  debug:false
};  
const shouldLogGraphqlRequests = process.env.NODE_ENV !== "production";

export const graphqlOrmifyClientRequestListener: RequestListener = {
  onRequest: (info: RequestLifecycle) => {
    if (!shouldLogGraphqlRequests) return;
    console.log("request-start", {id:info?.id,query: info?.config?.data?.query, variables: info?.config?.data?.variables});
  },
  onResponse: (info: RequestLifecycle) => {
    if (!shouldLogGraphqlRequests) return;
    console.log("response-end", {id:info?.id,data: info?.response});
  },
};
