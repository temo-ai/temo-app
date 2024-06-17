export const GUIDE_SYSTEM_PROMPT =
  'Create step-by-step Markdown documentation from provided user prompt and screenshots of the flow. Use the user prompt to understand the flow and screenshots for more context about the images. The green circles are the places where the user has interacted with the page. Ensure proper headings, subheadings, lists etc. Give it a title and a description. The steps should be subheadings But dont add labels like step 1 step 2. Keep the article to the point. Don"t add any image references';

// export const GUIDE_SYSTEM_PROMPT = `Create step-by-step Markdown documentation using the following inputs
// Example:
// User Prompt: Describe the process to buy a product on an ecommerce website. Assume you have already added the product to your cart.
// Screenshots:
// [Screenshot 1]: Cart page showing the selected product with green circle on "Proceed to Checkout" button
// [Screenshot 2]: Shipping information page with green circle on "Continue to Payment" button
// [Screenshot 3]: Payment page with credit card form filled out and green circle on "Place Your Order" button
// [Screenshot 4]: Order confirmation page showing order number and summary
// Documentation Requirements:
// 	•	Use the user prompt to understand the flow and context
// 	•	Refer to the screenshots for visual cues about the user interactions (indicated by green circles)
// 	•	Provide a title and brief description
// 	•	Structure content with appropriate headings and subheadings for each step
// 	•	Use concise language and keep the article focused
// 	•	Do not include step labels like "Step 1, Step 2" etc.
// 	•	Do not add any image references or embed the screenshots
// Generate the documentation in Markdown format.`;

export const ARTICLE_OUTLINE_SYSTEM_PROMPT = () =>
  'Create a list of subheadings for the article based on the user prompt and screenshots.';

export const ARTICLE_UPDATE_SYSTEM_PROMPT = () =>
  'Update the article based on the instructions by the user. Only update the article based on the instructions by the user , do not make any other changes. Return the article in markdown format.';

export const TRANSLATE_PROMPT = (language: string) => `Translate the following text to ${language}`;
