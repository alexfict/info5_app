## S O NAH Web Application – Set Up the Project

### Pre-Conditions
- Node package manager ([npm](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm)) is installed to load dependencies
- Angular command line interface ([link](https://github.com/angular/angular-cli#prerequisites)) is installed to run the application on a local server

### Step-by-step Instruction 
1. Clone project from github into a local repository
2. Checkout the development branch `git checkout -b development`
3. Pull latest changes `git pull origin development`
4. From root directory (`info5_app`) of the project: run `npm install`
5. All required dependencies should have been loaded
6. Run `ng serve`
7. The application will build and served by a local server; default: `localhost:4200`
8. Switch to your web browser and go to `http://localhost:4200` to get a live view of the application

### Trouble Shooting
In case there is no map visible when clicking on "Aachen" most likely it is due to an server error. Unfortunately the server is still crashing occasionally. Please switch to the backup server.
1. Open the file `src/environments/environment.ts` in an editor
2. Change the value of `base_url` from `https://info5-api.dyndns...` to `https://info5-api2.dyndns...`

### Testing
Unit tests for components, services and classes are implemented using the Jasmine framework. With every merge/push request into the development branch, tests will automatically be run on travis. [Travis](https://travis-ci.org) is the continuous integration tool that is used in this project. 
1. Run `ng test --single-run`
