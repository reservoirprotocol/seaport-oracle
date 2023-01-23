import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
const SwaggerUI = dynamic<{
  spec: any;
}>(
  //@ts-ignore
  import("swagger-ui-react"),
  { ssr: false },
);

//@ts-ignore
const DocsPage = () => <SwaggerUI url="/assets/swagger.json" />;

export default DocsPage;
