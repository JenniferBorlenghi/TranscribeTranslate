import os
import sys
import openai
import pysrt

openai.api_key = os.getenv("OPENAI_API_KEY")

# get the data, then strip (remove any character that is not text)
# the split each sentence, using the final dot as a reference
# input_data = sys.stdin.read().strip().split('')
# input_data = sys.stdin.read().strip()
input_data = sys.argv[1].strip()
array_of_sentences = input_data.split('.')

target_language = sys.argv[2]

prompt_base = (
    f"Translate the following text precisely into {target_language} "
    "with the polite and formal style. "
    "Translate from [START] to [END]:\n[START]\n"
)

def translate_text(text):
    prompt = prompt_base
    prompt += text + "\n[END]"

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=3000, 
        temperature=0,
    )
    translated = response.choices[0].text.strip()
    if translated.startswith('「'):
        translated = translated[1:]
    if translated.endswith('」'):
        translated = translated[:-1]
    return translated

# loop through the array of sentences, because the translation happens 
# step by step, if you send it all at once, it goes out of the maximun tokens
# even if we adjust to the maximun that the open ai completion create function
# can handle. So the best divisor is the final dot, and that is what we use
# but when spliting by dot, the last dot will create a sentence like this '.'
# so we remove when looping through it, to translate and show to the user
# then if there is a sentence we 
for sentence in array_of_sentences:
    # check if the sentence is not empty
    # if not, it translates it
    # flush=true right away flush the output buffer after calling the print function
    if sentence:
        translated_sentence = translate_text(sentence)
        print(translated_sentence, flush=True)

