# Layoffs Tracker

**LayoffsTracker** is a data visualization dashboard focused on tracking layoffs in the tech industry. It provides insightful, real-time charts and timelines to explore job cuts by company, date, and sector.

## Features
- Interactive charts tracking tech industry layoffs
- Filters by company, date, and industry
- Timeline visualizations of major layoff events
- Clean, responsive design with Tailwind CSS

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Recharts, Tailwind CSS
- **Data Source**: Static CSV files or Airtable
- **Deployment**: GitHub Pages

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/data-insider-nyc/layoffstracker
    cd layoffstracker
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

    This will start the app at `http://localhost:5173`.

## Build and Deployment

To build the app for production and deploy it, follow these steps:

1. Build the project:

    ```bash
    npm run build
    ```

    This will generate a `dist` folder containing the optimized production build.

2. Deploy to GitHub Pages:

    ```bash
    npm run deploy
    ```

    This will push the latest build to the `gh-pages` branch and deploy it to GitHub Pages.

## Development

1. **Run Locally**: To run the app locally for development, you can use the `npm run dev` command. This will start a development server with hot-reloading.

2. **Make Changes**: Edit the components, data files, and styles as needed.

3. **Linting**: To run linting on your code, use the following command:

    ```bash
    npm run lint
    ```

4. **Create a Pull Request**: When you're done making changes, push them to your branch and open a pull request to merge them into the main branch.

## Contributing

Feel free to fork the repository, make changes, and open pull requests. Contributions are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


[![GitHub Stars](https://img.shields.io/github/stars/data-insider-nyc/layoffstracker?style=social)](https://github.com/data-insider-nyc/layoffstracker/stargazers)