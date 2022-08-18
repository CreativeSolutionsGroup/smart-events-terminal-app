# SmartEvents Terminal App
## Setting up Autologin
We can get a user to automatically log in to TTY1 by modifying the getty@tty1
service in systemd.  
The ExecStart line has to be overwritten, which can be done with:

    sudo systemctl edit getty@tty1

Then before the comment that says "Lines below this comment will be discarded":

    [Service]
    ExecStart=
    ExecStart=-/sbin/agetty -a <USERNAME> --noclear %I $TERM

To test that it works you can restart, or run:

    sudo systemctl restart getty@tty1

## Starting the Application on Login
To make TTY1 automatically start the application, the .bashrc file in the home folder of the user that is automatically logged in has to be modified.  
At the end of .bashrc, add:

    ...
    if [[ "$(tty)" == "/dev/tty1" ]]
    then
      <COMMAND>
    fi

`<COMMAND>` being whichever command is used to run the program.  
The if statement `[[ "$(tty)" == "/dev/tty1" ]]` prevents the program from being opened on each bash session the user loads.