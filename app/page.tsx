'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { 
  Users, 
  FileText, 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle, 
  X, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  HelpCircle,
  TrendingDown,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { getDashboardStats } from '@/app/actions/dashboard';
import { getLeads, createLead, updateLeadStatus, deleteLead } from '@/app/actions/leads';
import { getOrcamentos, createOrcamento, updateOrcamentoStatus, deleteOrcamento } from '@/app/actions/orcamentos';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'orcamentos'>('overview');
  
  // Real-time states
  const { data: stats, mutate: mutateStats, error: statsError } = useSWR('stats', getDashboardStats);
  const { data: leads = [], mutate: mutateLeads } = useSWR('leads', getLeads);
  const { data: orcamentos = [], mutate: mutateOrcamentos } = useSWR('orcamentos', getOrcamentos);

  // Form states - Lead
  const [leadModal, setLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({ nome: '', empresa: '', email: '', telefone: '', origem: 'WhatsApp' });
  const [formLoading, setFormLoading] = useState(false);

  // Form states - Orcamento
  const [orcamentoModal, setOrcamentoModal] = useState(false);
  const [newOrcamento, setNewOrcamento] = useState({
    cliente: '',
    documento: '',
    telefone: '',
    email: '',
    status: 'PENDENTE'
  });
  const [orcamentoItens, setOrcamentoItens] = useState<Array<{ descricao: string; qtd: number; preco: number }>>([
    { descricao: '', qtd: 1, preco: 0 }
  ]);

  // Handle Refresh
  const handleRefresh = async () => {
    await Promise.all([mutateStats(), mutateLeads(), mutateOrcamentos()]);
  };

  // Add Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.nome) return;
    setFormLoading(true);
    const res = await createLead(newLead);
    if (res.success) {
      setNewLead({ nome: '', empresa: '', email: '', telefone: '', origem: 'WhatsApp' });
      setLeadModal(false);
      mutateLeads();
      mutateStats();
    }
    setFormLoading(false);
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (confirm('Deseja realmente remover este Lead?')) {
      const res = await deleteLead(id);
      if (res.success) {
        mutateLeads();
        mutateStats();
      }
    }
  };

  // Change Lead Status
  const handleUpdateLeadStatus = async (id: string, status: string) => {
    const res = await updateLeadStatus(id, status);
    if (res.success) {
      mutateLeads();
      mutateStats();
    }
  };

  // Add Item to Orcamento
  const addOrcamentoItem = () => {
    setOrcamentoItens([...orcamentoItens, { descricao: '', qtd: 1, preco: 0 }]);
  };

  // Remove Item from Orcamento
  const removeOrcamentoItem = (index: number) => {
    if (orcamentoItens.length > 1) {
      setOrcamentoItens(orcamentoItens.filter((_, i) => i !== index));
    }
  };

  const updateOrcamentoItemField = (index: number, field: string, value: any) => {
    const updated = orcamentoItens.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setOrcamentoItens(updated);
  };

  // Calculate quote total
  const calculatedTotal = orcamentoItens.reduce((acc, item) => acc + (item.qtd * item.preco), 0);

  // Add Orcamento
  const handleCreateOrcamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrcamento.cliente) return;
    setFormLoading(true);

    const validItens = orcamentoItens.filter(item => item.descricao && item.preco > 0);
    if (validItens.length === 0) {
      alert('Adicione pelo menos um item válido com descrição e preço!');
      setFormLoading(false);
      return;
    }

    const res = await createOrcamento({
      ...newOrcamento,
      itens: validItens,
      valorTotal: calculatedTotal
    });

    if (res.success) {
      setNewOrcamento({ cliente: '', documento: '', telefone: '', email: '', status: 'PENDENTE' });
      setOrcamentoItens([{ descricao: '', qtd: 1, preco: 0 }]);
      setOrcamentoModal(false);
      mutateOrcamentos();
      mutateStats();
    }
    setFormLoading(false);
  };

  // Toggle quote approve
  const handleToggleOrcamentoStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'APROVADO' ? 'PENDENTE' : 'APROVADO';
    const res = await updateOrcamentoStatus(id, nextStatus);
    if (res.success) {
      mutateOrcamentos();
      mutateStats();
    }
  };

  // Delete Orcamento
  const handleDeleteOrcamento = async (id: string) => {
    if (confirm('Remover este orçamento permanentemente?')) {
      const res = await deleteOrcamento(id);
      if (res.success) {
        mutateOrcamentos();
        mutateStats();
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6" id="dashboard-root">
      {/* Upper Navigation Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5" id="header-id">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono" id="app-title-id">
              SILKPRINT <span className="text-emerald-500">ERP</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" id="db-status-id">
              Atlas Connected
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1" id="app-desc-id">
            Controle de leads, faturamento e orçamento em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end" id="header-actions-id">
          <button 
            onClick={handleRefresh}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors"
            title="Atualizar dados"
            id="btn-refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => {
              if (activeTab === 'leads') setLeadModal(true);
              else setOrcamentoModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg shadow-sm shadow-emerald-500/10 transition-colors"
            id="btn-add-shortcut"
          >
            <Plus className="h-4 w-4" />
            <span>Novo {activeTab === 'leads' ? 'Lead' : 'Orçamento'}</span>
          </button>
        </div>
      </header>

      {/* KPI Cards Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/60 transition-all" id="card-leads">
          <div className="flex items-center justify-between" id="lead-metric">
            <span className="text-xs text-zinc-400 font-medium">Contatos & Leads</span>
            <span className="p-2 bg-zinc-800 rounded-lg text-emerald-400"><Users className="h-4 w-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">{stats?.leadsTotais ?? 0}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> {stats?.leadsConvertidos ?? 0}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Leads convertidos para Clientes</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/60 transition-all" id="card-conversion">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Orçamentos Ativos</span>
            <span className="p-2 bg-zinc-800 rounded-lg text-blue-400"><FileText className="h-4 w-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">{stats?.totalOrcamentos ?? 0}</span>
            <span className="text-xs text-blue-400 font-medium flex items-center gap-0.5"><CheckCircle className="h-3 w-3" /> {stats?.orcamentosAprovados ?? 0}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">{stats?.orcamentosPendentes ?? 0} aguardando aprovação</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/60 transition-all" id="card-paid">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Receita Liquidada (Paga)</span>
            <span className="p-2 bg-zinc-800 rounded-lg text-emerald-500"><DollarSign className="h-4 w-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">R$ {(stats?.receitaPaga ?? 0).toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Faturamento finalizado</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/60 transition-all" id="card-pending">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Contas em Aberto / Pendente</span>
            <span className="p-2 bg-zinc-800 rounded-lg text-amber-500"><Clock className="h-4 w-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">R$ {(stats?.totalEmAberto ?? 0).toLocaleString('pt-BR')}</span>
            {stats?.totalAtrasado > 0 && (
              <span className="text-xs text-rose-500 font-medium flex items-center gap-0.5 bg-rose-500/10 px-1.5 py-0.5 rounded" title="Atrasado"><AlertTriangle className="h-3 w-3" /> R$ {stats?.totalAtrasado}</span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-2">Aguardando vencimento</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-zinc-800 flex items-center gap-1" id="tab-navigation">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === 'overview' ? 'border-emerald-500 text-white bg-zinc-900/20' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
          id="tab-overview"
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === 'leads' ? 'border-emerald-500 text-white bg-zinc-900/20' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
          id="tab-leads"
        >
          Contatos & Leads
        </button>
        <button
          onClick={() => setActiveTab('orcamentos')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === 'orcamentos' ? 'border-emerald-500 text-white bg-zinc-900/20' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
          id="tab-orcamentos"
        >
          Orçamentos
        </button>
      </div>

      {/* Tab Panels */}
      <main className="space-y-6" id="dashboard-panels">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overview-grid">
            {/* Left side column: Recents */}
            <div className="lg:col-span-2 space-y-6" id="overview-left">
              {/* Recent Leads */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5" id="recent-leads-section">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Leads Adicionados Recentemente</h3>
                  <button onClick={() => setActiveTab('leads')} className="text-xs text-emerald-400 hover:underline">Ver todos</button>
                </div>

                <div className="overflow-x-auto" id="recent-leads-container">
                  {leads.length === 0 && (stats?.recentLeads?.length ?? 0) === 0 ? (
                    <div className="text-center py-6 text-zinc-500 text-sm">Nenhum Lead cadastrado ainda.</div>
                  ) : (
                    <table className="w-full text-left border-collapse" id="recent-leads-table">
                      <thead>
                        <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                          <th className="pb-2 font-medium">Nome / Cliente</th>
                          <th className="pb-2 font-medium">Empresa</th>
                          <th className="pb-2 font-medium">Origem</th>
                          <th className="pb-2 font-medium">Origem Canal</th>
                          <th className="pb-2 font-medium text-right font-mono">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/40 text-sm">
                        {(leads.length > 0 ? leads.slice(0, 5) : stats?.recentLeads ?? []).map((l: any) => (
                          <tr key={l.id} className="text-zinc-300">
                            <td className="py-2.5 font-medium text-white">{l.nome}</td>
                            <td className="py-2.5 text-zinc-400">{l.empresa || '-'}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                l.status === 'Novo' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                l.status === 'Em Atendimento' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                l.status === 'Convertido' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
                              }`}>
                                {l.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-zinc-400">{l.origem || 'Direto'}</td>
                            <td className="py-2.5 text-right font-mono">
                              <button onClick={() => handleDeleteLead(l.id)} className="text-zinc-500 hover:text-rose-400 p-1">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Recent Quotes */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5" id="recent-quotes-section">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Últimos Orçamentos Emitidos</h3>
                  <button onClick={() => setActiveTab('orcamentos')} className="text-xs text-emerald-400 hover:underline">Ver todos</button>
                </div>

                <div className="overflow-x-auto" id="recent-quotes-container">
                  {orcamentos.length === 0 && (stats?.recentOrcamentos?.length ?? 0) === 0 ? (
                    <div className="text-center py-6 text-zinc-500 text-sm">Nenhum orçamento cadastrado.</div>
                  ) : (
                    <table className="w-full text-left border-collapse" id="recent-quotes-table">
                      <thead>
                        <tr className="border-b border-zinc-800 text-xs text-zinc-400 font-mono">
                          <th className="pb-2 font-medium">Cliente</th>
                          <th className="pb-2 font-medium">Total</th>
                          <th className="pb-2 font-medium">Status</th>
                          <th className="pb-2 font-medium">Data Emissão</th>
                          <th className="pb-2 font-medium text-right">Controles</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/40 text-sm">
                        {(orcamentos.length > 0 ? orcamentos.slice(0, 5) : stats?.recentOrcamentos ?? []).map((orc: any) => (
                          <tr key={orc.id} className="text-zinc-300">
                            <td className="py-2.5 font-medium text-white">{orc.cliente}</td>
                            <td className="py-2.5 font-medium text-emerald-400">R$ {orc.valorTotal?.toLocaleString('pt-BR')}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                orc.status === 'APROVADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {orc.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-zinc-500">{new Date(orc.createdAt).toLocaleDateString()}</td>
                            <td className="py-2.5 text-right">
                              <button 
                                onClick={() => handleToggleOrcamentoStatus(orc.id, orc.status)}
                                className={`px-2 py-1 rounded text-xs font-semibold ${orc.status === 'APROVADO' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                              >
                                {orc.status === 'APROVADO' ? 'Reverter' : 'Aprovar'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Column (Finances / Stats Detail) */}
            <div className="space-y-6" id="overview-right">
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5" id="sales-channels-breakdown">
                <h3 className="text-md font-semibold text-white mb-4">Relatório Financeiro Silkprint</h3>
                
                <div className="space-y-4" id="stat-progress-bars">
                  <div>
                    <div className="flex md:items-center justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-400">Metas Líquidas Liquidadas</span>
                      <span className="text-emerald-400">{(stats?.receitaPaga / (stats?.totalReceita || 1) * 100 || 0).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min((stats?.receitaPaga / (stats?.totalReceita || 1) * 100 || 0), 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex md:items-center justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-400">Giro de Contas Pendente</span>
                      <span className="text-amber-500">{(stats?.totalEmAberto / (stats?.totalReceita || 1) * 100 || 0).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${Math.min((stats?.totalEmAberto / (stats?.totalReceita || 1) * 100 || 0), 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {stats?.totalAtrasado > 0 && (
                    <div className="p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10 flex items-start gap-2.5">
                      <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-rose-400">Faturamento Inadimplente</h4>
                        <p className="text-xs text-zinc-400 mt-1">Existem R$ {(stats?.totalAtrasado ?? 0).toLocaleString('pt-BR')} atrasados fora da carência limite de vencimento.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5" id="production-status">
                <h3 className="text-sm font-semibold text-white mb-3">Workflow Silkprint ERP</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Utilize esta aplicação para gerenciar a fidelização de marcas que solicitam serviços de estamparia personalizada para camisas, brindes e uniformes. O faturamento é automatizado no momento em que os orçamentos de orçamento são aprovados.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5" id="leads-root-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Funil de Leads & Contatos da Oficina</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Veja seus contatos de atacado da oficina e altere o status para progredir no CRM.</p>
              </div>

              <button 
                onClick={() => setLeadModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg"
              >
                <Plus className="h-4 w-4" /> Adicionar Lead
              </button>
            </div>

            <div className="overflow-x-auto" id="table-leads-manager">
              {leads.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">Nenhum lead encontrado. Crie um novo acima!</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs text-zinc-400 font-mono">
                      <th className="pb-3 font-medium">Nome</th>
                      <th className="pb-3 font-medium">Empresa</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Telefone</th>
                      <th className="pb-3 font-medium">Canal</th>
                      <th className="pb-3 font-medium">Evolução do Lead</th>
                      <th className="pb-3 font-medium text-right">Excluir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-sm">
                    {leads.map((l: any) => (
                      <tr key={l.id} className="text-zinc-300">
                        <td className="py-3 font-semibold text-white">{l.nome}</td>
                        <td className="py-3 text-zinc-400">{l.empresa || '-'}</td>
                        <td className="py-3 text-zinc-400">{l.email || '-'}</td>
                        <td className="py-3 text-zinc-400">{l.telefone || '-'}</td>
                        <td className="py-3 text-zinc-400">{l.origem || 'WhatsApp'}</td>
                        <td className="py-3">
                          <select 
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded px-2.5 py-1 focus:border-emerald-500 outline-none"
                          >
                            <option value="Novo">Novo</option>
                            <option value="Em Atendimento">Em Atendimento</option>
                            <option value="Convertido">Convertido</option>
                            <option value="Perdido">Perdido</option>
                          </select>
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDeleteLead(l.id)} className="text-zinc-600 hover:text-rose-400 p-1 inline-flex">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orcamentos' && (
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5" id="quotes-root-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Emissão de Orçamentos de Silkprint</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Gere orçamentos e aprove para criar instantaneamente faturamento no contas a receber.</p>
              </div>

              <button 
                onClick={() => setOrcamentoModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg"
              >
                <Plus className="h-4 w-4" /> Novo Orçamento
              </button>
            </div>

            <div className="overflow-x-auto" id="table-quotes-manager">
              {orcamentos.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">Nenhum orçamento emitido ainda.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs text-zinc-400 font-mono">
                      <th className="pb-3 font-medium">Cliente</th>
                      <th className="pb-3 font-medium">Documento CNPJ/CPF</th>
                      <th className="pb-3 font-medium">Itens Inclusos</th>
                      <th className="pb-3 font-medium">Valor Total</th>
                      <th className="pb-3 font-medium">Progresso</th>
                      <th className="pb-3 font-medium">Emissão</th>
                      <th className="pb-3 font-medium text-right">Remover</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-sm">
                    {orcamentos.map((orc: any) => (
                      <tr key={orc.id} className="text-zinc-300">
                        <td className="py-3 font-medium text-white">{orc.cliente}</td>
                        <td className="py-3 text-zinc-500">{orc.documento || 'Consumidor'}</td>
                        <td className="py-3">
                          <div className="flex flex-col gap-0.5 max-w-xs justify-center" id="quote-listed-items">
                            {Array.isArray(orc.itens) ? (orc.itens).map((item: any, i: number) => (
                              <span key={i} className="text-xs text-zinc-400 block truncate">
                                • {item.descricao} ({item.qtd}x R$ {item.preco})
                              </span>
                            )) : <span className="text-xs text-zinc-500">Item Único</span>}
                          </div>
                        </td>
                        <td className="py-3 font-bold text-emerald-400">R$ {orc.valorTotal?.toLocaleString('pt-BR')}</td>
                        <td className="py-3">
                          <button 
                            onClick={() => handleToggleOrcamentoStatus(orc.id, orc.status)}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                              orc.status === 'APROVADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20'
                            }`}
                          >
                            {orc.status === 'APROVADO' ? '✔ Aprovado' : '⌛ Pendente'}
                          </button>
                        </td>
                        <td className="py-3 text-zinc-500">{new Date(orc.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDeleteOrcamento(orc.id)} className="text-zinc-600 hover:text-rose-400 p-1 inline-flex">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* LEAD CREATION MODAL */}
      {leadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto" id="lead-modal-box">
            <button onClick={() => setLeadModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white" id="close-lead-modal">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4">Adicionar Contato à Silkprint</h3>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Nome do Cliente *</label>
                <input 
                  type="text" 
                  required
                  value={newLead.nome}
                  onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })}
                  placeholder="Ex: Pedro Fonseca"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Empresa / Marca</label>
                <input 
                  type="text" 
                  value={newLead.empresa}
                  onChange={(e) => setNewLead({ ...newLead, empresa: e.target.value })}
                  placeholder="Ex: Fonseca Estampas"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">E-mail</label>
                  <input 
                    type="email" 
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="Ex: pedro@email.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Celular / WhatsApp</label>
                  <input 
                    type="text" 
                    value={newLead.telefone}
                    onChange={(e) => setNewLead({ ...newLead, telefone: e.target.value })}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Origem do Lead</label>
                <select 
                  value={newLead.origem}
                  onChange={(e) => setNewLead({ ...newLead, origem: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Google / Site">Google / Site</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={formLoading}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-medium text-sm rounded-lg transition-colors mt-2"
              >
                {formLoading ? 'Salvando...' : 'Cadastrar Lead'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORCAMENTO BUILDER MODAL */}
      {orcamentoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto" id="orcamento-modal-box">
            <button onClick={() => setOrcamentoModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white" id="close-orcamento-modal">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-2">Novo Orçamento Inteligente</h3>
            <p className="text-xs text-zinc-400 mb-4 font-mono">Defina os serviços de matrizes, telas ou camisas para faturamento automático.</p>

            <form onSubmit={handleCreateOrcamento} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Nome do Cliente / Marca *</label>
                  <input 
                    type="text" 
                    required
                    value={newOrcamento.cliente}
                    onChange={(e) => setNewOrcamento({ ...newOrcamento, cliente: e.target.value })}
                    placeholder="Ex: Reserva Atacado"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">CPF / CNPJ Documento</label>
                  <input 
                    type="text" 
                    value={newOrcamento.documento}
                    onChange={(e) => setNewOrcamento({ ...newOrcamento, documento: e.target.value })}
                    placeholder="Ex: 00.000.000/0001-00"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="border border-zinc-800 rounded-xl p-4 space-y-4 bg-zinc-950/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Itens de Confecção</h4>
                  <button 
                    type="button" 
                    onClick={addOrcamentoItem}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-855 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs rounded transition-colors"
                  >
                    <Plus className="h-3 w-3" /> Adicionar Item
                  </button>
                </div>

                <div className="space-y-3" id="builder-items-rows">
                  {orcamentoItens.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-grow">
                        <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Descrição</label>
                        <input 
                          type="text"
                          required
                          value={item.descricao}
                          onChange={(e) => updateOrcamentoItemField(index, 'descricao', e.target.value)}
                          placeholder="Ex: Embalagem Silk 2 Cores Frente"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div className="w-20">
                        <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Qtd</label>
                        <input 
                          type="number"
                          required
                          min="1"
                          value={item.qtd}
                          onChange={(e) => updateOrcamentoItemField(index, 'qtd', parseInt(e.target.value) || 1)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div className="w-28">
                        <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Preço Un (R$)</label>
                        <input 
                          type="number"
                          required
                          step="0.01"
                          value={item.preco}
                          onChange={(e) => updateOrcamentoItemField(index, 'preco', parseFloat(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeOrcamentoItem(index)}
                        className="p-2 text-zinc-500 hover:text-rose-400 mb-0.5 inline-flex"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4" id="modal-builder-total-row">
                <div>
                  <span className="text-xs text-zinc-400">Total do Orçamento Estimado</span>
                  <p className="text-xl font-bold text-emerald-400 font-mono">R$ {calculatedTotal.toLocaleString('pt-BR')}</p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={newOrcamento.status}
                    onChange={(e) => setNewOrcamento({ ...newOrcamento, status: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                  >
                    <option value="PENDENTE">Salvar como Pendente</option>
                    <option value="APROVADO">Salvar como Aprovado (Gera contas a receber)</option>
                  </select>

                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    {formLoading ? 'Salvando...' : 'Salvar Orçamento'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
