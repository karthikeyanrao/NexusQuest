use anchor_lang::prelude::*;

#[account]
pub struct UserAccount {
    pub owner: Pubkey,
    pub points: u64,
    pub sol_balance: u64,
}
