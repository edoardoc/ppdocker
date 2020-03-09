# utenti ftp
mkdir -p /home/ftpusers/gestionaleauto && (echo ${FTP_PASSWORD1}; echo ${FTP_PASSWORD1}) | pure-pw useradd gestionaleauto -f /etc/pure-ftpd/passwd/pureftpd.passwd -m -u ftpuser -d /home/ftpusers/gestionaleauto
