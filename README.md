# Carubbi.ChatbotStudio
Chatbot Studio is a platform to design, manage and run chatbots using a blockly-based interface, and a powerful engine over Microsoft Bot Framework. 

https://user-images.githubusercontent.com/1128724/168243164-812d8af8-a24b-4f11-a46c-f85d82017d64.mp4

Pre-requisitos:
* Visual Studio
* Visual Studio Code: 
* Fonte = Fonte fira code
* Sql Management Studio
* Insomnia
* .net Framework 4.5.2 (Caso instalado com VS aberto, reiniciar o VS antes de rodar o build)
* IIS Express
* LocalDb
* NVM
* Node 18
* bot framework emulator v3 (https://github.com/microsoft/BotFramework-Emulator/releases/tag/v3.5.36)
* yarn 1.22.5
* chocolatey 0.11.3
* Git for windows 2.33.0.windows.2
* ngrok

1. Clonar repositorio https://github.com/rcarubbi/Carubbi.ChatbotStudio
2. Configurar todos os projetos para arquitetura x64

3. Clicar no projeto Database com o botao direito e selecionar publish
4. Definir a instancia de servidor de banco de dados como MSSqlLocalDb 
5. Nomear o banco como botEditor e publicar
6. Rodar projeto Backend.Api, se solicitado, instalar o certificado de desenvolvimento

## Configurar o usuário admin padrão

7. Abrir o Insomnia, ir em preferences e remover a opcao Validate Certificates 
8. Criar um novo document como Carubbi.ChatbotStudio
9. Clicar no botao + e criar um request chamado CreateAdminUser com as seguintes configurações
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
10. Executar o script dbo.Inserts.data.sql no banco de dados

## Configurar acesso da UI ao backend

11. Criar um novo request chamado GrantBackendAccessToUI com as seguintes configurações
method: POST
URL: http://localhost:44398/api/AppAccess
header: Content-type: application/json
payload: "BotEditor UI"

copiar o clientId, accesskey e secretKey do response para os proximos passos
 
12. abrir o vs code na pasta carubbi-boteditor
13. Abrir o arquivo .env e substituir:
REACT_APP_CLIENT_ID={ClientId}:{AccessKey} 
REACT_APP_CLIENT_SECRET={SecretKey}

14. Abrir o arquivo configs/clientCredentials.json e substituir client_id={ClientId}:{AccessKey} e client_secret={ClientSecret}
15. Instalar node-gyp e dependencias https://github.com/nodejs/node-gyp
16. baixar as dependencias com yarn
17. Instalar serve - yarn global add serve
18. Criar conta no ngrok
19. configurar authtoken: ngrok config add-authtoken <TOKEN>
20. Build UI: npm run build (obs: pode ser necessario atualizar o react-scripts)
21. Check the sites configuration in the applicationhost.config file inside .vs folder:
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


## configurar o bot connector

22. baixar dependencias com yarn
23. abrir outra instancia do vs code na pasta carubbi-botconnector

24. Atualizar os paths nos arquivos bat BotEditor Backend.bat e BotEditor Frontend.bat
25. Rodar BotEditor Backend.bat e BotEditor Frontend.bat
