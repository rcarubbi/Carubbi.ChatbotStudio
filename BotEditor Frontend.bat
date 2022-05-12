@echo off

start cmd /c "cd C:\Users\rcaru\source\repos\Carubbi.ChatbotStudio\carubbi-botconnector\ & yarn start"
start cmd /c "cd C:\Users\rcaru\source\repos\Carubbi.ChatbotStudio\carubbi-boteditor\ & serve -s build -l 3000"
start cmd /c "ngrok http 3979 --host-header=localhost:3979"
"C:\Program Files\Google\Chrome\Application\chrome.exe" --start-fullscreen http://localhost:3000 