import os
import sys
import openai
import pysrt

openai.api_key = os.getenv("OPENAI_API_KEY")

# get the data, then strip (remove any character that is not text)
# the split each sentence, using the final dot as a reference, so 
# big amounts of text can be processed
input_data = sys.argv[1].strip()
array_of_sentences = input_data.split('.')

target_language = sys.argv[2]

prompt_base = (
    f"Translate the following text precisely into {target_language} "
    "with the polite and formal style. "
    "Translate from [START] to [END]:\n[START]\n"
)

# def translate_text(text):
#     prompt = prompt_base
#     prompt += text + "\n[END]"

#     response = openai.Completion.create(
#         model="text-davinci-003",
#         prompt=prompt,
#         max_tokens=3000, 
#         temperature=0,
#     )
#     translated = response.choices[0].text.strip()
#     if translated.startswith('「'):
#         translated = translated[1:]
#     if translated.endswith('」'):
#         translated = translated[:-1]
#     return translated

# for sentence in array_of_sentences:
#     # check if the sentence is not empty
#     # if not, it translates it
#     # flush=true right away flush the output buffer after calling the print function
#     if sentence:
#         translated_sentence = translate_text(sentence)
#         print(translated_sentence, flush=True)

translated_sentence = "Olá Olá Olá Olá Oh, Olá Bom dia. Bom dia. Olá! Como vai? Saudações! Como está? Olá Olá Bom dia.Olá! Como vai?"
print(translated_sentence,flush=True)
