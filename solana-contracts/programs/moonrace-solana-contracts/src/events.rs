use anchor_lang::prelude::*;

#[event]
pub struct PointsDepositEvent {
    pub user: Pubkey,
    pub sol_amount: u64,
    pub points_received: u64,
}

#[event]
pub struct PointsWithdrawEvent {
    pub user: Pubkey,
    pub sol_amount: u64,
    pub points_spent: u64,
}
