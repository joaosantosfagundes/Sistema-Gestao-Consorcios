import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "API Consórcio",
        description: "Sistema de gerenciamento de consórcios"
    },
    host: "localhost:5000",
    schemes: ["http"],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            }
        }
    }
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js"]; 
swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc)
.then(async () => {
    await import("./server.js");
});