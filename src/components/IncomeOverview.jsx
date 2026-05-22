import React from 'react'
import { DollarSign, PieChart, TrendingUp, Calendar } from 'lucide-react'
import { format, parseISO, startOfMonth, differenceInMonths } from 'date-fns'

const IncomeOverview = ({ tasks }) => {
    const completedTasks = tasks.filter(task => task.completed)

    // Group tasks by month
    const monthlyData = completedTasks.reduce((acc, task) => {
        const date = task.deadline ? parseISO(task.deadline) : parseISO(task.createdAt)
        const monthKey = format(date, 'yyyy-MM')

        if (!acc[monthKey]) {
            acc[monthKey] = {
                month: format(date, 'yyyy/MM'),
                totalPrice: 0,
                totalTip: 0,
                count: 0,
                tasks: []
            }
        }

        acc[monthKey].totalPrice += parseInt(task.price || 0)
        acc[monthKey].totalTip += parseInt(task.tip || 0)
        acc[monthKey].count += 1
        acc[monthKey].tasks.push(task)

        return acc
    }, {})

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => b.localeCompare(a))

    const totalIncome = completedTasks.reduce((sum, task) => sum + parseInt(task.price || 0) + parseInt(task.tip || 0), 0)
    const averageIncome = sortedMonths.length > 0 ? (totalIncome / sortedMonths.length).toFixed(0) : 0

    return (
        <div className="income-overview">
            <div className="stats-row">
                <div className="stat-card glass">
                    <div className="stat-icon income">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">總收入 (含打賞)</span>
                        <h2 className="stat-value">TWD {totalIncome.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon average">
                        <PieChart size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">每月平均收入</span>
                        <h2 className="stat-value">TWD {parseInt(averageIncome).toLocaleString()}</h2>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon count">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">累計完成件數</span>
                        <h2 className="stat-value">{completedTasks.length} 件</h2>
                    </div>
                </div>
            </div>

            <div className="monthly-list">
                <h3>每月明細</h3>
                {sortedMonths.length > 0 ? (
                    <div className="month-grid">
                        {sortedMonths.map(monthKey => {
                            const data = monthlyData[monthKey]
                            return (
                                <div key={monthKey} className="month-card glass">
                                    <div className="month-header">
                                        <h4>{data.month}</h4>
                                        <span className="count-badge">{data.count} 件</span>
                                    </div>
                                    <div className="month-body">
                                        <div className="income-item">
                                            <span>基礎收入</span>
                                            <span className="amount">+{data.totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="income-item">
                                            <span>打賞總額</span>
                                            <span className="amount tip">+{data.totalTip.toLocaleString()}</span>
                                        </div>
                                        <div className="total-divider"></div>
                                        <div className="income-item total">
                                            <span>總計本月</span>
                                            <span className="amount">TWD {(data.totalPrice + data.totalTip).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="empty-state glass">
                        <p>尚無已完成的案件收入紀錄。</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .income-overview {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    animation: fadeIn 0.4s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .stat-card {
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    border-radius: var(--border-radius-lg);
                }

                .stat-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .stat-icon.income { background: linear-gradient(135deg, #74c69d, #2d6a4f); }
                .stat-icon.average { background: linear-gradient(135deg, #B8C0FF, #7B2CBF); }
                .stat-icon.count { background: linear-gradient(135deg, #FFD6FF, #C9184A); }

                .stat-label {
                    display: block;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .monthly-list h3 {
                    margin-bottom: 1.5rem;
                    color: var(--text-main);
                    font-size: 1.25rem;
                }

                .month-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                .month-card {
                    padding: 1.5rem;
                    border-radius: var(--border-radius-lg);
                    border-top: 4px solid var(--primary);
                }

                .month-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .month-header h4 {
                    font-size: 1.1rem;
                    color: var(--text-main);
                }

                .count-badge {
                    background: rgba(184, 192, 255, 0.2);
                    color: var(--primary);
                    padding: 0.25rem 0.75rem;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 700;
                }

                .income-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.95rem;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                }

                .amount {
                    font-weight: 600;
                    color: var(--text-main);
                }

                .amount.tip {
                    color: #c9184a;
                }

                .total-divider {
                    height: 1px;
                    background: var(--glass-border);
                    margin: 1rem 0;
                }

                .income-item.total {
                    margin-bottom: 0;
                    margin-top: 0.5rem;
                    color: var(--text-main);
                    font-weight: 700;
                }

                .income-item.total .amount {
                    font-size: 1.1rem;
                    color: #74c69d;
                }
            `}</style>
        </div>
    )
}

export default IncomeOverview
