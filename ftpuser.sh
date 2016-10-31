echo 'CAMBIA:' 
echo 'vi /etc/ssh/sshd_config'
echo 'Subsystem       sftp    internal-sftp'

userdel -r rmdtmsoft
rm -fr /home/rmdtmsoft/
useradd -s /sbin/nologin rmdtmsoft
(echo ftpPasswordExample; echo ftpPasswordExample) | passwd rmdtmsoft
chmod 755 /home/rmdtmsoft/
