import axios from 'axios';
import './App.css';
import { useState, useEffect } from 'react';
import { importAll, ImageCollection } from './utils/loadSvgs';

interface CurrencyImageProps {
  currency: string;
  images: ImageCollection;
}

type CurrencyObject = {
  currency: string;
  date: string;
  price: number;
}


const CurrencyImage: React.FC<CurrencyImageProps> = ({ currency, images }) => {
  const normalizedCurrency = currency.toLowerCase();
  const imageSrc = images[normalizedCurrency];

  if (!imageSrc) {
    return null;
  }

  return <img src={imageSrc} alt={`${currency} icon`} />;
};

const App = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyObject[]>([]);
  const [images, setImages] = useState<ImageCollection>({});
  const [amount, setAmount] = useState<number | ''>('');
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    const url = 'https://interview.switcheo.com/prices.json';

    axios.get(url)
      .then(response => {
        setCurrencyData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    importAll().then((loadedImages) => {
      setImages(loadedImages);
    });
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  }

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && fromCurrency && toCurrency) {
      const fromRate = currencyData.find(currency => currency.currency === fromCurrency)?.price;
      const toRate = currencyData.find(currency => currency.currency === toCurrency)?.price;

      if (fromRate && toRate) {
        const result = (amount / fromRate) * toRate;
        setConvertedAmount(result);
      }
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleConvert}>
        <h5>Currency Converter</h5>

        <label htmlFor="from-currency">From Currency</label>
        <div className="currency-select">
          <select id="from-currency" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            <option value="">Select currency</option>
            {currencyData.map(currency => (
              <option key={currency.currency} value={currency.currency}>{currency.currency}</option>
            ))}
          </select>
          {fromCurrency && <CurrencyImage currency={fromCurrency} images={images} />}
        </div>

        <label htmlFor="to-currency">To Currency</label>
        <div className="currency-select">
          <select id="to-currency" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            <option value="">Select currency</option>
            {currencyData.map(currency => (
              <option key={currency.currency} value={currency.currency}>{currency.currency}</option>
            ))}
          </select>
          {toCurrency && <CurrencyImage currency={toCurrency} images={images} />}
        </div>

        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          min={0}
        />

        <button type="submit">Convert</button>
      </form>

      {convertedAmount !== null && (
        <div className="converted-amount">
          <h5>Converted Amount</h5>
          <p>{convertedAmount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
