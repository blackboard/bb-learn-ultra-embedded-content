// Allows importing json files without type errors
declare module "*.json" {
    const value: any;
    export default value;
}

// Allows importing js files without type errors
declare module "*.js"