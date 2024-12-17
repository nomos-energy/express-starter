import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { splitPeriod } from './slp/split-period';
import { calculateEnergyProfile } from "./slp/calculate-energy-profile";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/api/split-period', (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Both startDate and endDate are required' 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)' 
      });
    }

    if (end < start) {
      return res.status(400).json({ 
        error: 'endDate must be after startDate' 
      });
    }

    const periods = splitPeriod(start, end);
    
    res.json({ periods });
  } catch (error) {
    console.error('Error processing split-period request:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

app.post('/api/calculate-energy-profile', (req, res) => {
  const { startDate, endDate, resolution } = req.body;
  if (!startDate || !endDate || !resolution) {
    return res.status(400).json({ error: 'startDate, endDate, and resolution are required' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return res.status(400).json({ error: 'endDate must be after startDate' });
  }

  const energyProfile = calculateEnergyProfile(start, end, resolution);
  res.json({ energyProfile });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
