const express = require('express');
const router = express.Router();
const Eleitor = require('../models/Eleitor');

router.post('/', async (req, res) => {
    console.log('Requisição POST recebida em /api/eleitores com dados:', req.body);

    const { nome, etitulo, vote, foto } = req.body;

    if (!nome || !etitulo) {
        console.error('Erro de validação: Campos obrigatórios faltando.');
        return res.status(400).json({ message: 'Os campos nome e etitulo são obrigatórios.' });
    }

    try {
        const newEleitor = new Eleitor({ nome, etitulo, vote, foto });
        await newEleitor.save();
        console.log('Novo eleitor salvo:', newEleitor);
        res.json(newEleitor);
    } catch (error) {
        console.error('Erro ao salvar o eleitor:', error);
        res.status(500).json({ message: 'Erro ao salvar o eleitor.', error });
    }
});

router.get('/', async (req, res) => {
    console.log('Requisição GET recebida em /api/eleitores');
    try {
        const eleitores = await Eleitor.find();
        console.log('Lista de eleitores:', eleitores);
        res.json(eleitores);
    } catch (error) {
        console.error('Erro ao listar eleitores:', error);
        res.status(500).json({ message: 'Erro ao listar eleitores.', error });
    }
});

router.put('/:id', async (req, res) => {
    console.log('Requisição PUT recebida em /api/eleitores com dados:', req.body);
    const { nome, etitulo, vote, foto } = req.body;

    try {
        const eleitor = await Eleitor.findById(req.params.id);
        if (!eleitor) {
            return res.status(404).json({ message: 'Eleitor não encontrado' });
        }

        eleitor.nome = nome;
        eleitor.etitulo = etitulo;
        eleitor.vote = vote;
        eleitor.foto = foto;
        await eleitor.save();

        res.json(eleitor);
    } catch (error) {
        console.error('Erro ao atualizar eleitor:', error);
        res.status(500).json({ message: 'Erro ao atualizar eleitor.', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const eleitor = await Eleitor.findById(req.params.id);
        if (!eleitor) {
            return res.status(404).json({ message: 'Eleitor não encontrado' });
        }

        await Eleitor.deleteOne({ _id: req.params.id });
        res.json({ message: 'Eleitor excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir eleitor:', error);
        res.status(500).json({ message: 'Erro ao excluir eleitor.', error });
    }
});

module.exports = router;
