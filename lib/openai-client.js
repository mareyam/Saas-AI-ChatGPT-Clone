import OpenAI from 'openai';
import { useSelector } from 'react-redux';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateOpenAIResponse(prompt, selectedModel) {}

// async function generateOpenAIResponse(prompt, selectedModel) {
//   const selectedConversation = useSelector(
//     (state) => state.conversation.selectedConversation
//   );

//   const chatHistory = [
//     ...selectedConversation,
//     { role: 'user', content: prompt },
//   ];
//   console.log('chatHistory', chatHistory);

//   if (chatHistory.length > 11) {
//     chatHistory.splice(1, 1);
//   }

//   // messages: [{ role: 'user', content: prompt }],

//   const completion = await openai.chat.completions.create({
//     model: selectedModel,
//     messages: chatHistory,
//     max_tokens: 150,
//   });
//   return completion.choices[0].message.content;
// }

async function interactImageWithOpenAI(imageUrl, selectedModel, prompt) {
  console.log('interactImageWithOpenAI');
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });
  return completion.choices[0].message.content;
}

async function createCustomGPT({
  name,
  description,
  instructions,
  conversationStarters,
  capabilities,
  prompt,
  model,
  temperature,
  top_p,
  max_tokens,
  frequency_penalty,
  presence_penalty,
  stop,
}) {
  const capabilitiesStr =
    typeof capabilities === 'object'
      ? JSON.stringify(capabilities)
      : capabilities;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: `You're a custom made ChatGPT Model, your name is ${name}. You can do ${description}. You have these instructions ${instructions}. You have these capabilities ${capabilitiesStr}. and these might be the conversation starters ${conversationStarters}. This is the prompt ${prompt}`,
      },
    ],
    temperature,
    top_p,
    max_tokens,
    frequency_penalty,
    presence_penalty,
    stop,
  });
  return completion.choices[0].message.content;
}

export {
  generateOpenAIResponse,
  openai,
  interactImageWithOpenAI,
  createCustomGPT,
};
