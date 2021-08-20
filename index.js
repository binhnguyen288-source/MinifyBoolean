

const variables = ['A', 'B', 'C', 'D', 'E', 'F'];
let number_of_varibles = 2;


function init(n) {
    number_of_varibles = n;
    const table = document.querySelector('table');

    const [head, body] = table.children;
    head.innerHTML = '';
    body.innerHTML = '';
    // head
    {
        const headtr = document.createElement('tr');
        for (let i = 0; i < n; ++i) {
            const headtd = document.createElement('td');
            headtd.innerText = `\\(${variables[i]}\\)`;
            headtr.appendChild(headtd);
        }
        {
            const headtd = document.createElement('td');
            headtd.innerText = '\\(\\text{True}\\)';
            headtr.appendChild(headtd);
        }
        {
            const headtd = document.createElement('td');
            headtd.innerText = `\\(\\text{Don't care}\\)`;
            headtr.appendChild(headtd);
        }
        head.appendChild(headtr);
    }
    // body
    {
        const m = 1 << n;
        for (let i = 0; i < m; ++i) {
            const bodytr = document.createElement('tr');


            for (let j = 0; j < n; ++j) {
                const bodytd = document.createElement('td');
                bodytd.innerText = `\\(${(i >> (n - j - 1) & 1)}\\)`.toString();
                bodytr.appendChild(bodytd);
            }
            {
                const bodytd = document.createElement('td');
                bodytd.innerHTML = `<div class="form-check">
                <input class="form-check-input" type="checkbox" value="">
            </div>`;
                bodytr.appendChild(bodytd);
                
            }

            {
                const bodytd = document.createElement('td');
                bodytd.innerHTML = `<div class="form-check">
                <input class="form-check-input" type="checkbox" value="">
            </div>`;
                bodytr.appendChild(bodytd);
                
            }

            body.appendChild(bodytr);
        }
    }
    MathJax.typeset();

}

Module.onRuntimeInitialized = () => {
    document.getElementById('solvebtn').onclick = solve;
    function solve() {
        const n = number_of_varibles;
        const body = document.querySelector('table').children[1];
        const m = 1 << n;
        let truth_table = '';
        let dont_care = '';
        for (let i = m - 1; i >= 0; --i) {
            const tr = body.children[i];
            const td = tr.children;

            truth_table += td[td.length - 2].children[0].children[0].checked ? "1" : "0";
            dont_care += td[td.length - 1].children[0].children[0].checked ? "0" : "1";
        }
        console.log({truth_table, dont_care});
        let output = document.getElementById('disableNOT').checked ?   Module.ccall('minifyBooleanNoNegate', 'string', ['string', 'string', 'number'], [truth_table, dont_care, n]) :
                                                                       Module.ccall('minifyBoolean', 'string', ['string', 'string', 'number'], [truth_table, dont_care, n]);

        output = output.replaceAll('!', '\\bar ');
        output = output.replaceAll('&', '');
        output = output.replaceAll('|', '+');
        output = output.replaceAll('^', ' \\oplus ');

        function typeset(code) {
            MathJax.startup.promise = MathJax.startup.promise
              .then(() => MathJax.typesetPromise(code))
              .catch((err) => console.log('Typeset failed: ' + err.message));
            return MathJax.startup.promise;
          }
        
        const result = document.getElementById('result');
        result.innerText = `\\(\\text{The absolute minified expression for the truth table is}\\)\\[ f = ${output}\\]`;

        typeset([result]);

    }
}