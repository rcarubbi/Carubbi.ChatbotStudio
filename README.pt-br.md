# Carubbi.ChatbotStudio
Chatbot Studio é uma plataforma para criar, gerenciar and executar chatbots usando uma interface baseada em blockly, e um poderoso motor escrito sobre o Microsoft Bot Framework. 

*Leia isto em outros idiomas: [English](README.md), [Português](README.pt-br.md).*

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

## Preparando o backend

1. Clonar repositório https://github.com/rcarubbi/Carubbi.ChatbotStudio
2. Configurar todos os projetos para arquitetura x64

3. Clicar no projeto Database com o botão direito e selecionar publish
4. Definir a instância de servidor de banco de dados como MSSqlLocalDb 
5. Nomear o banco como botEditor e publicar
6. Rodar projeto Backend.Api, se solicitado, instalar o certificado de desenvolvimento

## Configurar o usuário admin padrão

7. Abrir o Insomnia, ir em preferences e remover a opção Validate Certificates 
8. Criar um novo document como Carubbi.ChatbotStudio
9. Clicar no botão + e criar um request chamado CreateAdminUser com as seguintes configurações
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

copiar o clientId, accesskey e secretKey do response para os próximos passos
 
12. Parar o backend
13. Abrir o vs code na pasta carubbi-boteditor
14. Abrir o arquivo .env e substituir:
REACT_APP_CLIENT_ID={ClientId}:{AccessKey} 
REACT_APP_CLIENT_SECRET={SecretKey}

15. Abrir o arquivo configs/clientCredentials.json e substituir client_id={ClientId}:{AccessKey} e client_secret={ClientSecret}
16. Instalar node-gyp e dependências https://github.com/nodejs/node-gyp
17. Baixar as dependências com yarn
18. Instalar serve - yarn global add serve
19. Criar conta no ngrok: https://dashboard.ngrok.com/signup
20. configurar authtoken: ngrok config add-authtoken <TOKEN>
21. Fazer o build da UI: npm run build (obs: pode ser necessário atualizar o react-scripts antes de fazer o build)
22. Verifique a configuração dos sites no arquivo applicationhost.config dentro da pasta .vs:
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


## Configurar o bot connector

23. Baixar as dependências com yarn
24. Abrir outra instância do vs code na pasta carubbi-botconnector

25. Atualizar os paths nos arquivos bat BotEditor Backend.bat e BotEditor Frontend.bat
26. Rodar BotEditor Backend.bat e BotEditor Frontend.bat
