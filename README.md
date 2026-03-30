# EV Pulse : A EV Data Analysis Dashboard

## Overview

The EV Pulse project is a comprehensive and data-driven platform developed to analyze, visualize, and interpret the rapidly evolving electric vehicle (EV) ecosystem. With the global shift toward sustainable transportation, there is an increasing need for intelligent systems that can process large volumes of EV-related data and provide meaningful insights. This project addresses that need by designing an integrated analytics dashboard that combines data engineering, analytical modeling, and interactive visualization into a unified system.

At its core, the project focuses on consolidating multi-source datasets that include EV sales, vehicle stock, charging infrastructure, energy consumption, and environmental indicators. These datasets are collected from diverse sources and often exist in different formats and structures. To ensure consistency and reliability, a structured data pipeline is implemented that performs data cleaning, transformation, and integration. This process eliminates inconsistencies such as missing values, duplicate records, and variations in units, thereby preparing the data for accurate analysis.

The analytical component of the system plays a crucial role in extracting meaningful insights from the processed data. Various techniques such as time-series analysis, comparative evaluation, and correlation analysis are applied to study trends in EV adoption, infrastructure growth, and energy demand. The system enables multi-dimensional analysis by considering factors such as region, powertrain technology, and transportation mode. This helps in identifying growth patterns, dominant markets, and emerging trends within the EV ecosystem.

One of the key highlights of the project is the development of an interactive dashboard that presents complex data in a visually intuitive manner. The dashboard includes dynamic features such as filtering, drill-down capabilities, and real-time updates, allowing users to explore data across multiple dimensions. Key performance indicators such as total EV sales, stock, growth rates, and infrastructure expansion are displayed to provide quick and actionable insights. The user interface is designed to be accessible to both technical and non-technical users, ensuring wider usability.

The project also emphasizes the relationship between EV adoption and charging infrastructure. By analyzing infrastructure growth alongside vehicle adoption, the system highlights the importance of accessibility in accelerating EV penetration. Additionally, energy consumption analysis provides insights into the increasing demand for electricity and the need for efficient energy management systems. Environmental impact analysis further demonstrates the role of EVs in reducing fossil fuel dependency and greenhouse gas emissions.

Another important aspect of the project is its scalability and adaptability. The system is designed using a modular architecture that allows easy integration of new datasets and advanced technologies. It supports future enhancements such as real-time data integration, predictive analytics, and machine learning models. This ensures that the platform remains relevant and capable of handling evolving data requirements.

Furthermore, the EV Pulse system serves as a decision-support tool for multiple stakeholders, including policymakers, researchers, and industry professionals. It enables informed decision-making by providing insights into market trends, infrastructure readiness, and sustainability metrics. The ability to perform scenario-based analysis and explore future trends adds significant value to strategic planning and policy development.

In conclusion, the EV Pulse project successfully demonstrates the potential of combining data analytics, visualization, and interactive technologies to address complex challenges in the electric vehicle domain. It provides a robust, scalable, and user-centric platform that enhances understanding of EV trends and supports the transition toward sustainable and energy-efficient transportation systems.

## Features

- **Interactive Dashboard**: Explore EV data through an intuitive, user-friendly interface with filtering, drill-down, and real-time updates.
- **Multi-Dimensional Analysis**: Analyze data by region, powertrain technology, vehicle mode, and more.
- **Key Performance Indicators (KPIs)**: View metrics like total EV sales, stock levels, growth rates, and infrastructure expansion.
- **Data Visualization**: Utilize charts, maps, and graphs powered by Recharts for clear data representation.
- **Data Pipeline**: Automated cleaning, transformation, and integration of multi-source datasets.
- **Analytical Insights**: Time-series analysis, comparative evaluations, and correlation studies.
- **Infrastructure Analysis**: Examine the relationship between EV adoption and charging infrastructure.
- **Environmental Impact**: Assess reductions in fossil fuel dependency and greenhouse gas emissions.
- **Scalable Architecture**: Modular design for easy integration of new data and technologies.
- **Responsive Design**: Accessible on various devices with a clean, modern UI.

## Technologies Used

- **Frontend Framework**: React 18 with TypeScript for type-safe development.
- **Build Tool**: Vite for fast development and optimized builds.
- **Styling**: Tailwind CSS for utility-first styling, with Shadcn UI components based on Radix UI primitives.
- **Charts and Visualization**: Recharts for interactive data charts.
- **Routing**: React Router DOM for client-side navigation.
- **State Management**: React Query for server state management and caching.
- **Forms**: React Hook Form with Zod for validation.
- **Animations**: Framer Motion for smooth UI transitions.
- **Testing**: Vitest for unit testing, Playwright for end-to-end testing.
- **Linting**: ESLint with TypeScript support.
- **Package Manager**: npm (with Bun lockfile for faster installs).

## Project Structure

```
ev-insights-hub-main/
├── public/                 # Static assets
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Shadcn UI components
│   │   └── dashboard/      # Dashboard-specific components (e.g., ChartCard, Sidebar)
│   ├── pages/              # Page components (e.g., OverviewPage, CountryPage)
│   ├── data/               # Data files and utilities
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── test/               # Test files
├── data/                   # Raw and processed data files
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Data Sources

The dashboard utilizes processed EV data from various sources, including:

- **EV Sales and Stock Data**: Historical and current data on EV sales, vehicle stock, and market penetration.
- **Charging Infrastructure**: Information on charging stations, networks, and accessibility.
- **Energy Consumption**: Metrics on electricity demand and consumption patterns.
- **Environmental Indicators**: Data on emissions reductions and sustainability metrics.

Data files are located in the `data/` directory, with processed datasets ready for analysis.

## Installation and Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ev-insights-hub.git
   cd ev-insights-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

## Usage

Once the application is running, navigate through the dashboard using the sidebar:

- **Overview**: Get a high-level view of EV trends and KPIs.
- **Country Analysis**: Explore data by specific countries.
- **Powertrain Analysis**: Analyze different EV powertrain technologies.
- **Projections**: View future EV adoption projections.
- **Optimization**: Tools for scenario-based analysis.

Use filters to customize data views, and interact with charts for detailed insights.

## Testing

Run tests with:
```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

End-to-end tests with Playwright:
```bash
npx playwright test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or feedback, please open an issue on GitHub or contact the maintainers.
