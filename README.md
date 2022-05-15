# Carubbi.ChatbotStudio
Chatbot Studio is a platform to design, manage and run chatbots using a blockly-based interface, and a powerful engine over Microsoft Bot Framework. 

*Read this in other languages: [English](README.md), [Português](README.pt-br.md).*

https://user-images.githubusercontent.com/1128724/168243164-812d8af8-a24b-4f11-a46c-f85d82017d64.mp4


https://user-images.githubusercontent.com/1128724/168454581-0590a0ca-59f2-4098-9299-c5a4563bde78.mp4


Pre-requisites:
* Visual Studio
* Visual Studio Code: 
* Fira code font
* Sql Management Studio
* Insomnia
* .net Framework 4.5.2 (If installed with a vs instance open, restart VS before build)
* IIS Express
* LocalDb
* NVM
* Node 18
* bot framework emulator v3 (https://github.com/microsoft/BotFramework-Emulator/releases/tag/v3.5.36)
* yarn 1.22.5
* chocolatey 0.11.3
* Git for windows 2.33.0.windows.2
* ngrok

## Preparing the backend

1. Clone the repository from https://github.com/rcarubbi/Carubbi.ChatbotStudio
2. Configure all projects to x64 architecture

3. Right-click on database project and click on publish
4. Set database instance as MSSqlLocalDb 
5. Name the database as botEditor and publish 
6. Run Backend.Api, install development certificate if asked

## Config default admin user

7. Run Insomnia, go to preferences and remove the Validate Certificates option 
8. Create a new document as Carubbi.ChatbotStudio
9. Click on + button to create a request called CreateAdminUser with the following parameters
method: POST
URL: http://localhost:44398/api/Account
header: Content-type: application/json
payload: 
{
	"username":"admin",
	"email":"admin@boteditor.com",
	"password":"admin",
	"active": 1
}
10. Run sql script dbo.Inserts.data.sql in the database created above

## Config backend access from UI

11. Create a new request called GrantBackendAccessToUI with the following paremeters:
method: POST
URL: http://localhost:44398/api/AppAccess
header: Content-type: application/json
payload: "BotEditor UI"

Copy clientId, accesskey and secretKey from response to use in the next steps

12. Stop the backend
13. Run vs code from folder carubbi-boteditor
14. Open .env file and replace:
REACT_APP_CLIENT_ID={ClientId}:{AccessKey} 
REACT_APP_CLIENT_SECRET={SecretKey}

15. Open configs/clientCredentials.json file and replace client_id={ClientId}:{AccessKey} e client_secret={ClientSecret}
16. Install node-gyp and dependencies following the guide https://github.com/nodejs/node-gyp
17. download dependencies with yarn
18. Install serve - yarn global add serve
19. Create a ngrok account https://dashboard.ngrok.com/signup
20. Configure authtoken: ngrok config add-authtoken <TOKEN>
21. Build UI: npm run build (note: can be required to update react-scripts before build)
22. Check the sites configuration in the applicationhost.config file inside .vs folder:
 <sites>
             <site name="Carubbi.BotEditor.SamplesApi" id="1">
                <application path="/" applicationPool="Clr4IntegratedAppPool">
                    <virtualDirectory path="/" physicalPath="C:\Users\rcaru\source\repos\Carubbi.ChatbotStudio\Carubbi.BotEditor.SamplesApi" />
                </application>
                <bindings>
                    <binding protocol="https" bindingInformation="*:44325:localhost" />
                    <binding protocol="http" bindingInformation="*:54401:localhost" />
                </bindings>
            </site>
            <site name="Carubbi.BotEditor.Api" id="2">
                <application path="/" applicationPool="Clr4IntegratedAppPool">
                    <virtualDirectory path="/" physicalPath="C:\Users\rcaru\source\repos\Carubbi.ChatbotStudio\Carubbi.BotEditor.Api" />
                </application>
                <bindings>
                    <binding protocol="http" bindingInformation="*:3979:localhost" />
                    <binding protocol="https" bindingInformation="*:44332:localhost" />
                </bindings>
            </site>
            <site name="Carubbi.BotEditor.Backend.Api" id="3">
                <application path="/" applicationPool="Clr4IntegratedAppPool">
                    <virtualDirectory path="/" physicalPath="C:\Users\rcaru\source\repos\Carubbi.ChatbotStudio\Carubbi.BotEditor.Backend.Api" />
                </application>
                <bindings>
                    <binding protocol="https" bindingInformation="*:44398:localhost" />
                    <binding protocol="http" bindingInformation="*:60819:localhost" />
                </bindings>
            </site>
            <site name="Carubbi.BotEditor.UI" id="4">
                <application path="/" applicationPool="Clr4IntegratedAppPool">
                    <virtualDirectory path="/" physicalPath="C:\Users\rcaru\source\repos\Carubbi.ChatbotStudio\Carubbi.BotEditor.UI" />
                </application>
                <bindings>
                    <binding protocol="https" bindingInformation="*:44354:localhost" />
                    <binding protocol="http" bindingInformation="*:53080:localhost" />
                </bindings>
            </site>


## Configure bot connector

23. Download dependencies with yarn
24. Open a 2nd instance of vs code from folder carubbi-botconnector

25. Update the paths in the bat files BotEditor Backend.bat e BotEditor Frontend.bat
26. Run BotEditor Backend.bat e BotEditor Frontend.bat
