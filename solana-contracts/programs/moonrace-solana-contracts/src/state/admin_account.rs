use anchor_lang::prelude::*;

#[account]
pub struct AdminAccount {
    pub admin: Pubkey,
}