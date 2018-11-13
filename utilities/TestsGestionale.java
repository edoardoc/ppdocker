import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.sql.SQLException;

public class TestsGestionale {

	public static void main(String[] args) throws IOException, SQLException {

			URL url = new URL("https://static.mediavacances.com/img/Thumbnails/F/106370/1286893_l.jpg");
			URLConnection conn = url.openConnection();
			InputStream immagine = conn.getInputStream();
            System.out.println("l'immagine e' acquisita " + immagine.available());	}
}
