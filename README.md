### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Neste Curso temos um ecommerce

Temos telas e 3 contextos para se comunicar entre as telas.

* Tela 1 - Login:
    Contexto de usuario

* Tela 2 - Feira
    Contexto de carrinho
    Provider para compartilhar o contexto com os components
    Hook customizado

* Tela 3 - Carrinho
    Contexto de pagamento
    Comunicação entre contextos para adicionar ou remover
    
### DisplayName

Podemos da um nome para o contexto e assim deixa mais facil o debug:

```
CarrinhoContext.displayName = "Carrinho";
```

### Tools

React Dev Tools para acompanhar os contextos