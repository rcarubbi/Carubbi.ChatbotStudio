@echo off

start cmd /c "cd %IISEXPRESS_PATH% & iisexpress /config:%CHATBOTSTUDIO_PATH%\.vs\Carubbi.ChatbotStudio\config\applicationhost.config /apppool:Clr4IntegratedAppPool"