/*
	Ho provveduto a generare una unit� pubblicitaria e un posizionamento 320x50 mobile da inserire nell'app, per ora � una sola sulla quale � attivo adsense.
	Per chiamare il banner bisogna inserire in testa all'applicazione lo script google tag
*/

<script type="text/javascript">
    googletag.cmd.push(function() {
      googletag.defineSlot('/1895801/mobile_all_320x50', [320, 50], 'mobile_all_320x50').addService(googletag.pubads());
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
</script>


<div id="mobile_all_320x50">
	<script type="text/javascript">
		googletag.cmd.push(function() { googletag.display('mobile_all_320x50'); });
	</script>
</div>


/*
	Ho provveduto a creare un'altra unit� pubblicitaria, 300x100, 
    pi� adatta al listato soprattutto su dispositivi che hanno schermi con multipli di 320px.
*/

<script type="text/javascript">
    googletag.cmd.push(function() {
      googletag.defineSlot('/1895801/mobile_all_300x100', [300, 100], 'mobile_all_300x100').addService(googletag.pubads());
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
</script>


<div id="mobile_all_300x100">
	<script type="text/javascript">
		googletag.cmd.push(function() { googletag.display('mobile_all_300x100'); });
	</script>
</div>
