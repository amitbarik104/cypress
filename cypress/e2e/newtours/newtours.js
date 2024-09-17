// Import Cypress Cucumber Preprocessor methods
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

// Step to open Wikipedia
Given('I open web browser for {string}', (url) => {
  cy.visit(url);
});

// Step to type in the search box
When('I type {string} on the search box', (searchQuery) => {
  cy.get('input[name="search"]').type(searchQuery);
});

// Step to click the search button
When('I click on the search button', () => {
  cy.get('button[type="submit"]').click();
});

// Verify the URL
Then('the URL should be {string}', (expectedUrl) => {
  cy.url().should('eq', expectedUrl);
});

// Verify that there is an image under the title "Nikola Tesla"
Then('I want to see an image under the title {string} on the right column', (title) => {
  cy.get('h1#firstHeading').should('have.text', title);
  // Ensures we only check for images inside the first infobox
  cy.get('.infobox').first().find('img').should('exist');
});

// Capture and log information about "Born, Died, Alma mater" in the right column
Then('I want to read information about {string} on the right column', (info) => {
  // Split the info string into individual terms (like "Born", "Died", "Alma mater")
  const infoArray = info.split(', '); // ["Born", "Died", "Alma mater"]
  
  // Narrow down to the first infobox (if there are multiple)
  cy.get('.infobox').first().within(() => {
    // Loop over each term, capture the content next to the label, and log it
    infoArray.forEach((term) => {
      // Target specific infobox labels inside <th> elements and their corresponding <td> for content
      cy.get('th.infobox-label').contains(term)
        .should('exist')
        .next('td') // Get the next sibling <td> element that contains the actual content
        .invoke('text') // Get the text content of the <td> element
        .then((content) => {
          // Log the captured content in the test output
          cy.log(`${term}: ${content}`);
        });
    });
  });
});

// Capture and log the content of the "Early Years" section
Then('I want to read a section about {string}', (section) => {
    cy.get('#mw-content-text').within(() => {
      // Locate the section heading
      cy.contains(section).should('exist')
        .parent() // Get the parent element that contains the section heading
        .nextUntil('h2, h3') // Capture the text until the next top-level heading or subsection heading
        .invoke('text') // Get the text content
        .then((content) => {
          // Log the captured content of the section
          cy.log(`Section - ${section}: ${content}`);
        });
    });
  });
  