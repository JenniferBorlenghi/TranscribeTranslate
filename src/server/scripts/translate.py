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

def translate_text(text):
    prompt = prompt_base
    prompt += text + "\n[END]"

    response = openai.Completion.create(
        model="text-davinci-002",
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

for sentence in array_of_sentences:
    if sentence:
        translated_sentence = translate_text(sentence)
        print(translated_sentence, flush=True)

# test_translated = "Neste vídeo, vou falar sobre diferentes tipos de sinais de parada. A primeira coisa que você quer saber ao se aproximar de um sinal de parada é qual tipo de sinal de parada é. Lembre-se, dirigir é tudo sobre clareza. Quanto mais claro você estiver sobre as regras da estrada, melhor motorista você se torna. Logo, saber qual o tipo de sinal de parada que se aproxima ajuda a tomar uma decisão melhor. Com a ajuda deste vídeo, você será capaz de dizer de longe qual tipo de sinal de parada você está se aproximando. Existem dois tipos de sinais de stop, de dois sentidos e de quatro sentidos. Uma placa de stop de mão dupla significa que há uma placa de stop apenas em duas direções, ou seja, do seu lado e do lado oposto. O tráfego à esquerda e à direita não tem sinal de parada. Assim, você precisa ceder o direito de imediato ao tráfego à sua esquerda e à sua direita e prosseguir com cautela quando a estrada estiver desobstruída. Um sinal de parada em quatro direções significa que há um sinal de parada em todas as quatro direções. Quem chegar primeiro em um sinal de stop de quatro vias tem o direito de passar primeiro. Primeiro vem, primeiro vai. Simples Se dois veículos chegarem ao mesmo tempo, o veículo à direita terá que logo seguir em frente. É muito fácil diferenciar um sinal de parada de dois sentidos de um sinal de parada de quatro sentidos. Um sinal de stop de dois sentidos parece assim E um sinal de parada em quatro vias parece assim A diferença entre os dois é uma placa metálica retangular branca sob o sinal de stop com 'all-way' escrito nela. O sinal de parada que tem uma placa retangular embaixo dele é um sinal de parada de quatro vias. Agora tenho a certeza de que pode dizer de longe que tipo de sinal de stop se aproxima. Eu venho seguindo essa estratégia há muito tempo e nunca tive nenhuma confusão em sinais de stop. Às vezes, você pode perder o sinal do seu lado e parar à frente dele. Não há necessidade de se preocupar. Você não precisa procurar sinais em todas as direções para ver que tipo de sinal de parada você está Basta olhar para o sinal do outro lado Se o sinal do outro lado da rua tiver uma placa retangular embaixo dele, então é um sinal de parada em quatro vias. Caso contrário, é uma via de mão dupla Agora, por que é importante para você saber a diferença entre os dois sinais de parada? Isso é porque o seu próximo movimento é baseado nisso. Em um sinal de stop de dois sentidos, você precisa ser extra cuidadoso, pois precisa ceder o direito de passagem para o tráfego à sua esquerda e à sua direita. Enquanto em um sinal de parada em quatro vias, quem chega primeiro vai primeiro. Eu já vi muitas pessoas cometerem o erro de tratarem uma placa de stop de duas vias como uma placa de stop de quatro vias e prosseguirem à direita depois do stop sem olhar para a esquerda e para a direita e acabarem buzinadas ou quase colidindo. Você poderia evitar essas situações se soubesse melhor Agora que você sabe a diferença entre dois tipos de sinais de stop, espero que você dirija com mais clareza. Cuidado e dirija com segurança."

# print(test_translated, flush=True)