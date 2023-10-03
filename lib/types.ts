export type Handler = (props: {
  params: { [key: string]: string };
  filters: { [key: string]: string };
  body: object | undefined;
  request: Request;
}) => Response | object | string | void;
