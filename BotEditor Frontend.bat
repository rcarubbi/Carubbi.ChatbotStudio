@echo off


start cmd /c "cd %CHATBOTSTUDIO_PATH%\carubbi-botconnector\ & yarn start"
start cmd /c "cd %CHATBOTSTUDIO_PATH%\carubbi-boteditor\ & serve -s build -l 3000"
start cmd /c "ngrok http 3980 --host-header=localhost:3980"
cd %CHROME_PATH% & chrome.exe --start-fullscreen http://localhost:3000 