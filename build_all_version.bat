echo STARTING PACKAGING

echo WIN 64
electron-packager ./Arionum-Electrum/ app --overwrite --platform win32 --arch x64 --icon=./Arionum-Electrum/assets/icons/128x128.ico --prune=true --version-string.CompanyName=Arionum --version-string.FileDescription=Arionum Wallet --version-string.ProductName="Arionum Wallet" --out export/
echo WIN 32
electron-packager ./Arionum-Electrum/ app --overwrite --platform win32 --arch ia32 --icon=./Arionum-Electrum/assets/icons/128x128.ico --prune=true --version-string.CompanyName=Arionum --version-string.FileDescription=Arionum Wallet --version-string.ProductName="Arionum Wallet" --out export/
echo OSX
electron-packager ./Arionum-Electrum/ app --overwrite --platform=darwin --arch=x64 --icon=./Arionum-Electrum/assets/icons/128x128.icns --prune=true --out export/
echo LINUX
electron-packager ./Arionum-Electrum/ app --overwrite --asar=true --platform=linux --arch=x64 --icon=./Arionum-Electrum/assets/icons/64x64.png --prune=true --out export/
echo ALL DONE

pause