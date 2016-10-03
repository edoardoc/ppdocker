docker stop mypostfix
docker rm mypostfix
docker run -d --name mypostfix -p 25:25 -e maildomain=mail.portaportese.it \
			-e smtp_user=ppmailer:ciccio123mail catatnight/postfix

