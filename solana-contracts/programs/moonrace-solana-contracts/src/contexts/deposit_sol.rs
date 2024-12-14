use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DepositSol<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}