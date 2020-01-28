echo 'CAMBIA:' 
echo 'vi /etc/ssh/sshd_config'
echo 'Subsystem       sftp    internal-sftp'

userdel -r rmdtmsoft
rm -fr /home/rmdtmsoft/
useradd -s /sbin/nologin rmdtmsoft
(echo 1218gbk; echo 1218gbk) | passwd rmdtmsoft
chmod 755 /home/rmdtmsoft/
