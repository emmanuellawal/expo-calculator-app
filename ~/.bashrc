# Android SDK Environment Variables
export ANDROID_HOME=/mnt/c/Users/elawa/AppData/Local/Android/Sdk
export ANDROID_SDK_ROOT=/mnt/c/Users/elawa/AppData/Local/Android/Sdk

# Create alias for ADB to use Windows executable
alias adb='/mnt/c/Windows/System32/cmd.exe /c "C:\\Users\\elawa\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe"'

# Update PATH with Android tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/emulator 