const apiUrl = 'http://localhost:3000/api/eleitores';

async function fetchEleitores() {
    try {
        const response = await fetch(apiUrl);
        const eleitores = await response.json();
        const eleitorList = document.getElementById('eleitorList');
        eleitorList.innerHTML = '';

        eleitores.forEach(eleitor => {
            const li = document.createElement('li');

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'details';
            detailsDiv.innerHTML = `
                <span><strong>Nome:</strong> ${eleitor.nome}</span>
                <span><strong>Título:</strong> ${eleitor.etitulo}</span>
                <span><strong>Já votou:</strong> ${eleitor.vote ? 'Sim' : 'Não'}</span>
                ${eleitor.foto ? `<img src="${eleitor.foto}" alt="Foto" width="200">` : ''} <!-- Mostra a foto se disponível -->
            `;
            li.appendChild(detailsDiv);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteEleitor(eleitor._id);
            buttonGroup.appendChild(deleteButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => updateEleitor(eleitor);
            buttonGroup.appendChild(editButton);

            li.appendChild(buttonGroup);
            eleitorList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar eleitores:', error);
    }
}

async function addEleitor(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const etitulo = document.getElementById('etitulo').value;
    const vote = document.getElementById('vote').checked;
    const fotoInput = document.getElementById('foto');
    let foto = null;

    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        const reader = new FileReader();

        reader.onloadend = async () => {
            foto = reader.result;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, etitulo, vote, foto })
                });

                if (response.ok) {
                    fetchEleitores();
                    document.getElementById('eleitorForm').reset();
                } else {
                    console.error('Erro ao adicionar eleitor');
                }
            } catch (error) {
                console.error('Erro ao adicionar eleitor:', error);
            }
        };

        reader.readAsDataURL(file);
    } else {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, etitulo, vote })
            });

            if (response.ok) {
                fetchEleitores();
                document.getElementById('eleitorForm').reset();
            } else {
                console.error('Erro ao adicionar eleitor');
            }
        } catch (error) {
            console.error('Erro ao adicionar eleitor:', error);
        }
    }
}

async function deleteEleitor(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchEleitores();
        } else {
            console.error('Erro ao excluir eleitor');
        }
    } catch (error) {
        console.error('Erro ao excluir eleitor:', error);
    }
}

async function updateEleitor(eleitor) {
    const nome = prompt('Nome:', eleitor.nome);
    const etitulo = prompt('Título Eleitoral:', eleitor.etitulo);
    const vote = confirm('Já votou?');
    const foto = prompt('URL da foto (deixe em branco se não quiser alterar):', eleitor.foto || '');

    if (!nome || !etitulo) {
        alert('Os campos nome e título são obrigatórios.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${eleitor._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, etitulo, vote, foto })
        });

        if (response.ok) {
            fetchEleitores();
        } else {
            console.error('Erro ao atualizar eleitor');
        }
    } catch (error) {
        console.error('Erro ao atualizar eleitor:', error);
    }
}

document.getElementById('eleitorForm').addEventListener('submit', addEleitor);
fetchEleitores();
