use anchor_lang::prelude::*;
use crate::{errors::PointsError, state::{UserAccount, AdminAccount}};

pub fn handle(ctx: Context<AdminSubtractPoints>, points_to_subtract: u64) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;

    require!(
        user_account.points >= points_to_subtract,
        PointsError::InsufficientPoints
    );

    user_account.points -= points_to_subtract;

    Ok(())
}

#[derive(Accounts)]
pub struct AdminSubtractPoints<'info> {
    #[account(mut)]
    pub admin_account: Account<'info, AdminAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
}
