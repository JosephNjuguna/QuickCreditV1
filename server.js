import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
	if (err) {
		console.log(`api not listening on port ${port}`);
	} else {
		console.log(`api listening on ${port}`);
	}
});
