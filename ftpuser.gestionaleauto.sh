echo 'CAMBIA:' 
echo 'vi /etc/ssh/sshd_config'
echo 'Subsystem       sftp    internal-sftp'

userdel -r gestionaleauto
rm -fr /home/gestionaleauto/
useradd -s /sbin/nologin gestionaleauto
(echo ftpPasswordExample; echo ftpPasswordExample) | passwd gestionaleauto
chmod 755 /home/gestionaleauto/
